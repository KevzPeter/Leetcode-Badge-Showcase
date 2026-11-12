import type { NextApiRequest, NextApiResponse } from 'next';
import { cacheSuccess, noStore } from '../../../utils/cache-policy';
import { fetchProxyImage, ProxyError } from '../../../utils/image-proxy';

/** Restricted LeetCode image-to-data-URL proxy. The main badge endpoint does not depend on this route. */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    noStore(res);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(req.method || '')) {
        res.setHeader('Allow', 'GET, HEAD');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { img } = req.query;
    if (typeof img !== 'string' || !img.trim()) {
        res.status(400).json({ error: 'Invalid img parameter' });
        return;
    }
    const controller = new AbortController();
    const disconnect = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', disconnect);
    try {
        const dataUrl = await fetchProxyImage(img, controller.signal);
        cacheSuccess(res);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200);
        if (req.method === 'HEAD') res.end();
        else res.send(dataUrl);
    } catch (error) {
        if (controller.signal.aborted || res.destroyed) return;
        noStore(res);
        const safe = error instanceof ProxyError ? error : new ProxyError(502, 'Unable to download image');
        res.status(safe.status).json({ error: safe.message });
    } finally {
        res.off('close', disconnect);
    }
}
