/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');

const axios = require('axios');
const sharp = require('sharp');
const { gql, request } = require('graphql-request');
const { BADGE_SIZE, LOGO_SIZE, encodeStaticImage, encodeGifImage } = require('../utils/badge-images');

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
    const args = { users: null, rebuildStatic: false, cachedOnly: false, skipDiscovery: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--users') {
            if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error('--users requires a comma-separated user list');
            args.users = argv[i + 1];
            i++;
        } else if (a.startsWith('--users=')) {
            args.users = a.slice('--users='.length);
        } else if (a === '--rebuild-static') {
            args.rebuildStatic = true;
        } else if (a === '--cached-only') {
            args.cachedOnly = true;
        } else if (a === '--skip-discovery') {
            args.skipDiscovery = true;
        } else {
            throw new Error(`Unknown argument: ${a}`);
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
        maxContentLength: 10 * 1024 * 1024,
        validateStatus: (s) => s >= 200 && s < 300,
    });
    return resp.data;
}

async function convertToWebpDataUrl(imgURL, logo = false) {
    const data = await fetchArrayBuffer(imgURL);
    return encodeStaticImage(data, logo);
}

async function convertGifToDataUrl(imgURL) {
    const data = await fetchArrayBuffer(imgURL);
    return encodeGifImage(data);
}

function readCacheFile() {
    if (!fs.existsSync(CACHE_FILE)) return {};
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    if (!raw.trim()) return {};
    // Never replace a corrupt existing cache with an empty one during a scheduled run.
    return JSON.parse(raw);
}

function writeCacheFile(cache) {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    const serialized = JSON.stringify(cache);
    if (fs.existsSync(CACHE_FILE) && fs.readFileSync(CACHE_FILE, 'utf-8') === serialized) return false;
    fs.writeFileSync(CACHE_FILE, serialized);
    return true;
}

function selectUsers(args, envUsers = process.env.USERS) {
    return (args.users ?? (envUsers || 'LeoHunt,hc167,u77'))
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

// All cache entries are migrated, not just assets encountered on the discovery users.
async function rebuildStaticCache(cache, { cachedOnly = false, fetchImage = fetchArrayBuffer, log = console } = {}) {
    const stats = { resized: 0, fallback: 0, failed: 0 };
    const entries = Object.entries(cache).filter(([, data]) => typeof data === 'string' && data.startsWith('data:image/webp;base64,'));
    let index = 0;
    async function worker() {
        while (index < entries.length) {
            const [url, data] = entries[index++];
            try {
                const logo = url === 'imgURL' || url.endsWith('/leetcode-logo.png');
                const size = logo ? LOGO_SIZE : BADGE_SIZE;
                const oldBuffer = Buffer.from(data.split(',')[1], 'base64');
                const metadata = await sharp(oldBuffer).metadata();
                if (metadata.width <= size && metadata.height <= size) continue;
                let source = oldBuffer;
                if (!cachedOnly) {
                    try {
                        source = logo ? fs.readFileSync(path.join(process.cwd(), 'public', 'leetcode-logo.png')) : await fetchImage(url);
                    } catch {
                        stats.fallback++;
                        log.warn('Original asset unavailable; resizing its existing cached image:', url);
                    }
                }
                cache[url] = await encodeStaticImage(source, logo);
                stats.resized++;
            } catch {
                stats.failed++;
                log.warn('Static cache entry could not be migrated; original entry preserved:', url);
            }
        }
    }
    await Promise.all(Array.from({ length: 6 }, worker));
    return stats;
}

async function updateCache(cache, users, { fetchBadges, staticImage = convertToWebpDataUrl, gifImage = convertGifToDataUrl, log = console } = {}) {
    const stats = { added: 0, failed: 0 };
    const getBadges = fetchBadges || (username => request(`${LEETCODE_BASEURL}/graphql/`, gqlQuery, { username }));

    // Ensure LeetCode logo is cached (GitHub CSP blocks external images).
    const logoUrl = `${BASEURL}/leetcode-logo.png`;
    if (!cache[logoUrl] && cache.imgURL) {
        // Backwards compat: older cache used a literal key.
        cache[logoUrl] = cache.imgURL;
    }
    if (!cache[logoUrl]) {
        try {
            cache[logoUrl] = await staticImage(logoUrl, true);
            stats.added++;
        } catch {
            stats.failed++;
            log.warn('Failed to cache LeetCode logo');
        }
    }

    for (const username of users) {
        log.log(`Fetching badges for ${username}...`);
        let resp;
        try {
            resp = await getBadges(username);
            if (!resp?.matchedUser) throw new Error('User unavailable');
        } catch {
            stats.failed++;
            log.warn(`GraphQL failed for ${username}; existing entries preserved`);
            continue;
        }

        const badges = resp?.matchedUser?.badges ?? [];
        log.log(`  ${badges.length} badge(s)`);

        for (const badge of badges) {
            const iconUrl = normalizeLeetCodeUrl(badge?.icon);
            if (iconUrl && !cache[iconUrl]) {
                try {
                    cache[iconUrl] = await staticImage(iconUrl);
                    stats.added++;
                } catch {
                    stats.failed++;
                    log.warn('  icon failed:', iconUrl);
                }
            }

            const gifUrl = normalizeLeetCodeUrl(badge?.medal?.config?.iconGif);
            if (gifUrl && typeof gifUrl === 'string' && gifUrl.endsWith('.gif') && !cache[gifUrl]) {
                try {
                    cache[gifUrl] = await gifImage(gifUrl);
                    stats.added++;
                } catch {
                    stats.failed++;
                    log.warn('  gif failed:', gifUrl);
                }
            }
        }
    }

    // Keep file small: remove legacy key if present.
    if (cache.imgURL) delete cache.imgURL;
    return stats;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.cachedOnly && !args.rebuildStatic) throw new Error('--cached-only requires --rebuild-static');
    const users = selectUsers(args);
    if (!args.skipDiscovery && !users.length) throw new Error('No users provided. Use --users "u1,u2" or env USERS.');
    const cache = readCacheFile();
    let failed = 0;
    if (args.rebuildStatic) {
        const stats = await rebuildStaticCache(cache, args);
        console.log('Static migration:', stats);
        failed += stats.failed;
    }
    if (!args.skipDiscovery) {
        const stats = await updateCache(cache, users);
        console.log('Active-user discovery:', stats);
        failed += stats.failed;
    }
    console.log(writeCacheFile(cache) ? 'Cache updated' : 'Cache unchanged', CACHE_FILE);
    if (failed) {
        console.warn(`Partial cache update: ${failed} operation(s) failed; existing assets were preserved.`);
        process.exitCode = 1;
    }
}

module.exports = { parseArgs, selectUsers, rebuildStaticCache, updateCache };

if (require.main === module) {
    main().catch(() => {
        console.error('Cache update failed; inspect configuration and cache validity.');
        process.exitCode = 1;
    });
}
