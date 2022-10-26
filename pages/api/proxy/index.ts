import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
/**
 * Proxy endpoint that takes LeetCode badge image URL and returns its base64 representation. Images are
 * inlined into the final SVG because GitHub's Content Security Policy prohibits external images.
 */
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { img } = req.query;

    if (!img || Array.isArray(img)) {
        res.statusCode = 400;
        res.json({ error: 'Invalid img parameter' });
        return;
    }

    try {
        const { data } = await axios.get<string>(img, {
            responseType: 'arraybuffer',
        });
        const base64 = Buffer.from(data, 'binary').toString('base64');
        // Set cache for a week
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
        res.send(`data:image/png;base64,${base64}`);
    } catch (e) {
        const data = e?.response?.data;
        res.statusCode = 400;
        if (data) {
            res.json({ error: data.message });
        } else {
            res.json({ error: e.toString() });
        }
    }
};
