import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';
import { fetchProxyImage, isPublicAddress, MAX_IMAGE_BYTES, ProxyError, validateImageUrl } from '../utils/image-proxy';
import handler from '../pages/api/proxy';

const url = 'https://assets.leetcode.com/badge.png';
const lookup: any = async () => [{ address: '93.184.216.34', family: 4 }];
const png = () => sharp({ create: { width: 4, height: 4, channels: 4, background: '#ff000080' } }).png().toBuffer();
const fails = (status: number) => (error: unknown) => error instanceof ProxyError && error.status === status;

function transport(replies: Array<{ status?: number; headers?: object; chunks?: Buffer[] }>, inspect = (_url, _options) => {}) {
    let count = 0;
    const request: any = (target, options, respond) => {
        inspect(target, options);
        const req = new EventEmitter();
        const abort = () => req.emit('error', options.signal.reason);
        options.signal.addEventListener('abort', abort, { once: true });
        queueMicrotask(() => {
            const reply = replies[count++];
            if (!reply) return; // simulate an upstream that never responds
            const response: any = Readable.from(reply.chunks || []);
            response.statusCode = reply.status ?? 200;
            response.headers = reply.headers || {};
            response.on('close', () => options.signal.removeEventListener('abort', abort));
            respond(response);
        });
        return req;
    };
    return request;
}

for (const input of ['http://leetcode.com/a.png', 'https://leetcode.com.evil.test/a.png', 'https://evil.leetcode.com/a.png', 'https://leetcode.com@evil.test/a', 'https://user:pass@leetcode.com/a', 'https://leetcode.com:444/a', 'file:///etc/passwd', 'https://127.0.0.1/a', 'https://[::1]/a', 'not a URL', 'https://leetcode.com/' + 'x'.repeat(4096)]) {
    test(`rejects unsafe URL ${input.slice(0, 65)}`, () => assert.throws(() => validateImageUrl(input), fails(400)));
}

test('accepts only exact approved hosts, HTTPS default port and no credentials', () => {
    assert.equal(validateImageUrl('https://leetcode.com:443/static/a.png#fragment').href, 'https://leetcode.com/static/a.png');
    assert.equal(validateImageUrl(url).hostname, 'assets.leetcode.com');
});

for (const address of ['127.0.0.1', '10.0.0.1', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '224.0.0.1', '192.0.2.1', '::1', '::', 'fe80::1', 'fc00::1', '2001:db8::1', '::ffff:127.0.0.1', '64:ff9b::a00:1']) {
    test(`rejects non-public address ${address}`, () => assert.equal(isPublicAddress(address), false));
}

test('pins checked DNS addresses without forwarding credentials or disabling TLS', async () => {
    let resolutions = 0;
    const image = await png();
    const result = await fetchProxyImage(url, undefined, {
        lookup: (async () => { resolutions++; return [{ address: '93.184.216.34', family: 4 }]; }) as any,
        request: transport([{ chunks: [image], headers: { 'content-type': 'text/html' } }], (target, options) => {
            assert.equal(target.hostname, 'assets.leetcode.com');
            assert.equal(options.agent, false);
            assert.notEqual(options.rejectUnauthorized, false);
            assert.equal(options.headers.Authorization, undefined);
            assert.equal(options.headers.Cookie, undefined);
            options.lookup(target.hostname, { all: true }, (error, addresses) => {
                assert.ifError(error);
                assert.deepEqual(addresses, [{ address: '93.184.216.34', family: 4 }]);
            });
            options.lookup(target.hostname, {}, (error, address, family) => {
                assert.ifError(error);
                assert.equal(address, '93.184.216.34');
                assert.equal(family, 4);
            });
        }),
    });
    assert.equal(resolutions, 1);
    assert.equal(result, `data:image/png;base64,${image.toString('base64')}`);
});

test('blocks mixed public/private DNS results before opening any connection', async () => {
    await assert.rejects(fetchProxyImage(url, undefined, {
        lookup: (async () => [{ address: '93.184.216.34', family: 4 }, { address: '::1', family: 6 }]) as any,
        request: (() => assert.fail('must not connect')) as any,
    }), fails(400));
});

test('validates redirected hosts and re-resolves destinations to prevent rebinding', async () => {
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([{ status: 302, headers: { location: 'https://evil.test/x' } }]) }), fails(400));
    let calls = 0;
    await assert.rejects(fetchProxyImage(url, undefined, {
        lookup: (async () => [{ address: ++calls === 1 ? '93.184.216.34' : '10.0.0.1', family: 4 }]) as any,
        request: transport([{ status: 302, headers: { location: '/next.png' } }]),
    }), fails(400));
    assert.equal(calls, 2);
});

test('follows safe relative redirects and caps redirect loops', async () => {
    assert.match(await fetchProxyImage(url, undefined, { lookup, request: transport([{ status: 302, headers: { location: '/next.png' } }, { chunks: [await png()] }]) }), /^data:image\/png;base64,/);
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport(Array.from({ length: 4 }, () => ({ status: 302, headers: { location: '/loop' } }))) }), fails(502));
});

test('enforces declared, streamed and decompressed byte limits', async () => {
    const huge = Buffer.alloc(MAX_IMAGE_BYTES + 1);
    for (const reply of [
        { headers: { 'content-length': String(huge.length) } },
        { chunks: [huge.subarray(0, MAX_IMAGE_BYTES), huge.subarray(MAX_IMAGE_BYTES)] },
        { headers: { 'content-encoding': 'gzip' }, chunks: [gzipSync(huge)] },
    ]) await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([reply]) }), fails(413));
});

test('ignores spoofed image MIME headers and rejects malformed/vector content', async () => {
    for (const text of ['<html>error</html>', '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>', 'invalid']) {
        await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([{ headers: { 'content-type': 'image/png' }, chunks: [Buffer.from(text)] }]) }), fails(502));
    }
});

test('verified raster MIME types survive and gzip responses decode correctly', async () => {
    const image = await png();
    for (const [format, mime] of [['jpeg', 'image/jpeg'], ['webp', 'image/webp'], ['gif', 'image/gif']] as const) {
        const encoded = await sharp(image).toFormat(format).toBuffer();
        assert.match(await fetchProxyImage(url, undefined, { lookup, request: transport([{ chunks: [encoded] }]) }), new RegExp(`^data:${mime};base64,`));
    }
    assert.equal(await fetchProxyImage(url, undefined, { lookup, request: transport([{ headers: { 'content-encoding': 'gzip' }, chunks: [gzipSync(image)] }]) }), `data:image/png;base64,${image.toString('base64')}`);
});

test('base64 response limit stays below the buffered Function response ceiling', async () => {
    const imageWithTrailingData = Buffer.concat([await png(), Buffer.alloc(3200 * 1024)]);
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([{ chunks: [imageWithTrailingData] }]) }), fails(413));
});

test('bounds raster pixel counts', async () => {
    const large = await sharp({ create: { width: 4097, height: 4097, channels: 3, background: 'red' } }).png().toBuffer();
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([{ chunks: [large] }]) }), fails(502));
});

test('total deadline includes DNS and slow responses; disconnect cancels work', async () => {
    await assert.rejects(fetchProxyImage(url, undefined, { lookup: (() => new Promise(() => {})) as any, timeoutMs: 20 }), fails(504));
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([]), timeoutMs: 20 }), fails(504));
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(fetchProxyImage(url, controller.signal, { lookup }), fails(499));
});

test('upstream failures and network errors are sanitized', async () => {
    await assert.rejects(fetchProxyImage(url, undefined, { lookup, request: transport([{ status: 403, chunks: [Buffer.from('private upstream detail')] }]) }), error => {
        assert.equal((error as Error).message, 'Image source returned an error');
        return fails(502)(error);
    });
    await assert.rejects(fetchProxyImage(url, undefined, { lookup: (async () => { throw new Error('private address and secret'); }) as any }), error => {
        assert.equal((error as Error).message, 'Unable to download image');
        return fails(502)(error);
    });
});

test('handler rejects methods, missing/duplicate inputs, and disallowed hosts without caching errors', async () => {
    for (const [method, query, status] of [['POST', { img: url }, 405], ['GET', {}, 400], ['GET', { img: [url, url] }, 400], ['GET', { img: 'https://evil.test/a' }, 400]] as const) {
        const headers = {};
        const res: any = new EventEmitter();
        res.setHeader = (key, value) => { headers[key] = value; };
        res.status = value => { res.statusCode = value; return res; };
        res.json = value => { res.body = value; return res; };
        await handler({ method, query } as any, res);
        assert.equal(res.statusCode, status);
        assert.equal(headers['Cache-Control'], 'no-store');
        assert.equal(headers['Vercel-CDN-Cache-Control'], 'no-store');
        assert.equal(headers['X-Content-Type-Options'], 'nosniff');
        if (method === 'POST') assert.equal(headers['Allow'], 'GET, HEAD');
        assert.equal(Object.keys(res.body).join(','), 'error');
    }
});
