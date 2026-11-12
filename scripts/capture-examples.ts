import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { THEME_NAMES } from '../utils/config';
import { canonicalApiUrl } from '../utils/api-url';

async function main() {
    const base = process.env.CAPTURE_BASE_URL || 'http://localhost:3100';
    const username = process.env.CAPTURE_USERNAME || 'kevzpeter';
    const systemChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    const executablePath = process.env.CHROME_PATH || (existsSync(systemChrome) ? systemChrome : undefined);
    const browser = await chromium.launch({ executablePath });
    const directory = path.join(process.cwd(), 'images', 'examples');
    await mkdir(directory, { recursive: true });
    try {
        const page = await browser.newPage({ viewport: { width: 800, height: 1200 }, colorScheme: 'light', deviceScaleFactor: 1 });
        const examples = [
            ...THEME_NAMES.map(theme => ({ name: `theme-${theme}`, options: { theme, filter: 'study', limit: 4 } })),
            ...['comp', 'study', 'annual', 'submission', 'daily'].map(filter => ({ name: `filter-${filter}`, options: { username: filter === 'comp' ? 'LeoHunt' : username, theme: 'github-dark', filter, limit: ['comp', 'study'].includes(filter) ? 4 : 8 } })),
        ];
        for (const example of examples) {
            const url = new URL(canonicalApiUrl({ username, ...example.options }), base).href;
            const response = await page.goto(url);
            if (!response?.ok() || !response.headers()['content-type']?.includes('image/svg+xml')) throw new Error(`Image response unavailable: ${example.name}`);
            await page.evaluate(async () => {
                await Promise.all(Array.from(document.images).map(image => image.decode()));
                await document.fonts.ready;
            });
            const screenshot = await page.locator('svg').screenshot({ omitBackground: true });
            const optimized = await sharp(screenshot).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
            await writeFile(path.join(directory, `${example.name}.png`), optimized);
            console.log(`Captured ${example.name}: ${optimized.length} bytes`);
        }
    } finally { await browser.close(); }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
