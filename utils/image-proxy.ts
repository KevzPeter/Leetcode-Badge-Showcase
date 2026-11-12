import { lookup as dnsLookup } from 'node:dns/promises';
import { get as httpsGet } from 'node:https';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import ipaddr from 'ipaddr.js';
import sharp from 'sharp';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// Base64 expands the body by ~33%; stay below Vercel's buffered Function response ceiling.
export const MAX_DATA_URL_BYTES = 4 * 1024 * 1024;
const MAX_PIXELS = 16 * 1024 * 1024;
const ALLOWED_HOSTS = new Set(['leetcode.com', 'assets.leetcode.com']);
const MIME_TYPES = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };

export class ProxyError extends Error {
    constructor(public status: number, message: string) { super(message); }
}

export function validateImageUrl(input: string): URL {
    if (!input || input.length > 4096) throw new ProxyError(400, 'Invalid image URL');
    let url: URL;
    try { url = new URL(input); } catch { throw new ProxyError(400, 'Invalid image URL'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !ALLOWED_HOSTS.has(url.hostname)) {
        throw new ProxyError(400, 'Image URL is not allowed');
    }
    url.hash = '';
    return url;
}

export function isPublicAddress(address: string): boolean {
    try { return ipaddr.process(address).range() === 'unicast'; } catch { return false; }
}

function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
        const abort = () => reject(signal.reason);
        if (signal.aborted) return abort();
        signal.addEventListener('abort', abort, { once: true });
        work.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    });
}

type Dependencies = {
    lookup?: typeof dnsLookup;
    request?: typeof httpsGet;
    timeoutMs?: number;
};

// Dependency injection is internal/test-only; callers cannot override security policy through query or env values.
export async function fetchProxyImage(input: string, clientSignal?: AbortSignal, dependencies: Dependencies = {}) {
    let url = validateImageUrl(input);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new ProxyError(504, 'Image download timed out')), dependencies.timeoutMs ?? 10000);
    const disconnected = () => controller.abort(new ProxyError(499, 'Client disconnected'));
    clientSignal?.addEventListener('abort', disconnected, { once: true });
    if (clientSignal?.aborted) disconnected();
    const { signal } = controller;
    try {
        for (let redirects = 0; ; redirects++) {
            const addresses = await abortable((dependencies.lookup || dnsLookup)(url.hostname, { all: true, verbatim: true }), signal);
            if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
                throw new ProxyError(400, 'Image destination is not allowed');
            }
            // Pin this connection to the checked DNS answer; preserve the hostname for TLS/SNI verification.
            const address = addresses[0];
            const pinnedLookup = (_hostname, options, callback) => {
                if (options.all) callback(null, [address]);
                else callback(null, address.address, address.family);
            };
            const result = await new Promise<{ location?: string; body?: Buffer }>((resolve, reject) => {
                const request = (dependencies.request || httpsGet)(url, {
                    agent: false,
                    lookup: pinnedLookup,
                    signal,
                    maxHeaderSize: 16384,
                    headers: { Accept: 'image/png,image/jpeg,image/webp,image/gif', 'Accept-Encoding': 'identity' },
                }, response => {
                    const status = response.statusCode || 0;
                    if ([301, 302, 303, 307, 308].includes(status)) {
                        const location = response.headers.location;
                        response.destroy();
                        if (!location) reject(new ProxyError(502, 'Invalid image redirect'));
                        else resolve({ location });
                        return;
                    }
                    if (status !== 200) {
                        response.destroy();
                        reject(new ProxyError(502, 'Image source returned an error'));
                        return;
                    }
                    if (Number(response.headers['content-length']) > MAX_IMAGE_BYTES) {
                        response.destroy();
                        reject(new ProxyError(413, 'Image is too large'));
                        return;
                    }
                    const encoding = String(response.headers['content-encoding'] || 'identity').toLowerCase();
                    const decoder = encoding === 'gzip' ? createGunzip() : encoding === 'br' ? createBrotliDecompress()
                        : encoding === 'deflate' ? createInflate() : null;
                    if (encoding !== 'identity' && !decoder) {
                        response.destroy();
                        reject(new ProxyError(502, 'Unsupported image encoding'));
                        return;
                    }
                    // Count both compressed network bytes and decoded bytes as they arrive.
                    let wireBytes = 0;
                    let decodedBytes = 0;
                    const chunks: Buffer[] = [];
                    const wireLimit = new Transform({ transform(chunk, _encoding, callback) {
                        wireBytes += chunk.length;
                        callback(wireBytes > MAX_IMAGE_BYTES ? new ProxyError(413, 'Image is too large') : null, chunk);
                    } });
                    const collect = new Transform({ transform(chunk, _encoding, callback) {
                        decodedBytes += chunk.length;
                        if (decodedBytes > MAX_IMAGE_BYTES) return callback(new ProxyError(413, 'Image is too large'));
                        chunks.push(Buffer.from(chunk));
                        callback();
                    } });
                    const streams = decoder ? [response, wireLimit, decoder, collect] : [response, wireLimit, collect];
                    pipeline(streams, { signal }).then(() => resolve({ body: Buffer.concat(chunks) }), reject);
                });
                request.on('error', reject);
            });
            if (result.location) {
                if (redirects >= 3) throw new ProxyError(502, 'Too many image redirects');
                let next: string;
                try { next = new URL(result.location, url).href; } catch { throw new ProxyError(502, 'Invalid image redirect'); }
                url = validateImageUrl(next);
                continue;
            }
            const body = result.body!;
            // metadata() never renders vector content. Only bounded raster formats are accepted below.
            let metadata: sharp.Metadata;
            try { metadata = await abortable(sharp(body, { limitInputPixels: MAX_PIXELS }).metadata(), signal); }
            catch (error) {
                if (signal.aborted) throw signal.reason;
                throw new ProxyError(502, 'Source is not a supported image');
            }
            const mime = MIME_TYPES[metadata.format];
            const frames = metadata.pages || 1;
            const pixels = (metadata.width || 0) * (metadata.pageHeight || metadata.height || 0) * frames;
            if (!mime || !pixels || pixels > MAX_PIXELS) throw new ProxyError(502, 'Source is not a supported image');
            if (Math.ceil(body.length / 3) * 4 + `data:${mime};base64,`.length > MAX_DATA_URL_BYTES) {
                throw new ProxyError(413, 'Encoded image is too large');
            }
            return `data:${mime};base64,${body.toString('base64')}`;
        }
    } catch (error) {
        if (signal.aborted) throw signal.reason;
        if (error instanceof ProxyError) throw error;
        throw new ProxyError(502, 'Unable to download image');
    } finally {
        clearTimeout(timeout);
        clientSignal?.removeEventListener('abort', disconnected);
    }
}
