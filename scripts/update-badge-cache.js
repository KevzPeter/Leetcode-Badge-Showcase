/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');

const axios = require('axios');
const sharp = require('sharp');
const { gql, request } = require('graphql-request');

const LEETCODE_BASEURL = process.env.LEETCODE_BASEURL || 'https://leetcode.com';
const BASEURL = process.env.BASEURL || 'https://leetcode-badge-showcase.vercel.app';

const CACHE_FILE = path.join(process.cwd(), 'public', 'cache', 'base64.txt');

const gqlQuery = gql`
  query userBadges($username: String!) {
    matchedUser(username: $username) {
      badges {
        icon
        creationDate
        category
        medal {
          config {
            iconGif
          }
        }
      }
    }
  }
`;

function parseArgs(argv) {
    const args = { users: null };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--users') {
            args.users = argv[i + 1];
            i++;
        } else if (a.startsWith('--users=')) {
            args.users = a.slice('--users='.length);
        }
    }
    return args;
}

function normalizeLeetCodeUrl(url) {
    if (!url) return url;
    if (typeof url !== 'string') return url;
    if (url.startsWith('/static/')) return `${LEETCODE_BASEURL}${url}`;
    return url;
}

async function fetchArrayBuffer(url) {
    const resp = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        validateStatus: (s) => s >= 200 && s < 400,
    });
    return resp.data;
}

async function convertToWebpDataUrl(imgURL) {
    const data = await fetchArrayBuffer(imgURL);
    const webpBuffer = await sharp(data).webp().toBuffer();
    return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
}

async function convertGifToDataUrl(imgURL) {
    const data = await fetchArrayBuffer(imgURL);
    const resizedGifBuffer = await sharp(data, { animated: true })
        .resize({ width: 48, height: 48 })
        .gif()
        .toBuffer();
    return `data:image/gif;base64,${resizedGifBuffer.toString('base64')}`;
}

function readCacheFile() {
    if (!fs.existsSync(CACHE_FILE)) return {};
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    if (!raw.trim()) return {};
    try {
        return JSON.parse(raw);
    } catch {
        console.warn('Could not parse cache file; starting fresh');
        return {};
    }
}

function writeCacheFile(cache) {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const envUsers = process.env.USERS;
    const usersCsv = args.users ?? envUsers ?? 'LeoHunt,hc167,u77';
    const users = usersCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (users.length === 0) {
        console.error('No users provided. Use --users "u1,u2" or env USERS.');
        process.exit(1);
    }

    console.log(`Updating cache for ${users.length} user(s): ${users.join(', ')}`);

    const cache = readCacheFile();

    // Ensure LeetCode logo is cached (GitHub CSP blocks external images).
    const logoUrl = `${BASEURL}/leetcode-logo.png`;
    if (!cache[logoUrl] && cache.imgURL) {
        // Backwards compat: older cache used a literal key.
        cache[logoUrl] = cache.imgURL;
    }
    if (!cache[logoUrl]) {
        try {
            cache[logoUrl] = await convertToWebpDataUrl(logoUrl);
            console.log('Cached LeetCode logo');
        } catch (e) {
            console.warn('Failed to cache LeetCode logo:', e?.message ?? String(e));
        }
    }

    for (const username of users) {
        console.log(`Fetching badges for ${username}...`);
        let resp;
        try {
            resp = await request(`${LEETCODE_BASEURL}/graphql/`, gqlQuery, { username });
        } catch (e) {
            console.warn(`GraphQL failed for ${username}:`, e?.message ?? String(e));
            continue;
        }

        const badges = resp?.matchedUser?.badges ?? [];
        console.log(`  ${badges.length} badge(s)`);

        for (const badge of badges) {
            const iconUrl = normalizeLeetCodeUrl(badge?.icon);
            if (iconUrl && !cache[iconUrl]) {
                try {
                    cache[iconUrl] = await convertToWebpDataUrl(iconUrl);
                } catch (e) {
                    console.warn('  icon failed:', iconUrl, e?.message ?? String(e));
                }
            }

            const gifUrl = normalizeLeetCodeUrl(badge?.medal?.config?.iconGif);
            if (gifUrl && typeof gifUrl === 'string' && gifUrl.endsWith('.gif') && !cache[gifUrl]) {
                try {
                    cache[gifUrl] = await convertGifToDataUrl(gifUrl);
                } catch (e) {
                    console.warn('  gif failed:', gifUrl, e?.message ?? String(e));
                }
            }
        }
    }

    // Keep file small: remove legacy key if present.
    if (cache.imgURL) delete cache.imgURL;

    writeCacheFile(cache);
    console.log('Cache updated:', CACHE_FILE);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
