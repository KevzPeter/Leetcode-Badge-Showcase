import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
const { encodeStaticImage } = require('../utils/badge-images');
const { parseArgs, selectUsers, rebuildStaticCache, updateCache } = require('../scripts/update-badge-cache');
const log = { log() {}, warn() {} };
const logoUrl = 'https://leetcode-badge-showcase.vercel.app/leetcode-logo.png';
const input = () => sharp({ create: { width: 1080, height: 540, channels: 4, background: '#ff000080' } }).png().toBuffer();
const metadata = data => sharp(Buffer.from(data.split(',')[1], 'base64')).metadata();

test('runtime and updater static encoder preserves ratio and alpha at 2x display resolution', async () => {
    const original = await input();
    const badge = await metadata(await encodeStaticImage(original));
    const logo = await metadata(await encodeStaticImage(original, true));
    assert.deepEqual([badge.width, badge.height, badge.hasAlpha], [96, 48, true]);
    assert.deepEqual([logo.width, logo.height], [72, 36]);
    const small = await sharp(original).resize(24, 12).png().toBuffer();
    assert.equal((await metadata(await encodeStaticImage(small))).width, 24);
});

test('full migration includes non-discovery assets, preserves GIFs and is idempotent', async () => {
    const original = await input();
    const old = `data:image/webp;base64,${(await sharp(original).webp().toBuffer()).toString('base64')}`;
    const cache = { 'https://assets.leetcode.com/no-longer-in-discovery.png': old, [logoUrl]: old, 'https://assets.leetcode.com/a.gif': 'data:image/gif;base64,unchanged' };
    const stats = await rebuildStaticCache(cache, { cachedOnly: true, log });
    assert.equal(stats.resized, 2);
    assert.equal((await metadata(cache[logoUrl])).width, 72);
    assert.equal((await metadata(cache['https://assets.leetcode.com/no-longer-in-discovery.png'])).width, 96);
    assert.equal(cache['https://assets.leetcode.com/a.gif'], 'data:image/gif;base64,unchanged');
    const serialized = JSON.stringify(cache);
    assert.equal((await rebuildStaticCache(cache, { cachedOnly: true, log })).resized, 0);
    assert.equal(JSON.stringify(cache), serialized);
});

test('migration prefers source images, falls back to existing bytes and preserves unreadable entries', async () => {
    const original = await input();
    const old = `data:image/webp;base64,${(await sharp(original).webp().toBuffer()).toString('base64')}`;
    const cache = { 'https://assets.leetcode.com/ok.png': old, 'https://assets.leetcode.com/missing.png': old, 'https://assets.leetcode.com/bad.png': 'data:image/webp;base64,invalid' };
    const stats = await rebuildStaticCache(cache, { fetchImage: async url => { if (url.endsWith('missing.png')) throw new Error('unavailable'); return original; }, log });
    assert.deepEqual(stats, { resized: 2, fallback: 1, failed: 1 });
    assert.equal(cache['https://assets.leetcode.com/bad.png'], 'data:image/webp;base64,invalid');
});

test('scheduled discovery honors users, adds optimized static images and does not churn existing data', async () => {
    const original = await input();
    const cache = { [logoUrl]: await encodeStaticImage(original, true), existing: 'preserve' };
    const users: string[] = [];
    const dependencies = {
        log,
        fetchBadges: async username => { users.push(username); return { matchedUser: { badges: [{ icon: '/static/new.png', medal: { config: { iconGif: 'https://assets.leetcode.com/new.gif' } } }] } }; },
        staticImage: async () => encodeStaticImage(original),
        gifImage: async () => 'data:image/gif;base64,preserved',
    };
    assert.deepEqual(await updateCache(cache, ['active-one', 'active-two'], dependencies), { added: 2, failed: 0 });
    assert.deepEqual(users, ['active-one', 'active-two']);
    assert.equal((await metadata(cache['https://leetcode.com/static/new.png'])).width, 96);
    const before = JSON.stringify(cache);
    assert.deepEqual(await updateCache(cache, ['active-one'], dependencies), { added: 0, failed: 0 });
    assert.equal(JSON.stringify(cache), before);
    assert.deepEqual(await updateCache(cache, ['unavailable'], { ...dependencies, fetchBadges: async () => { throw new Error('down'); } }), { added: 0, failed: 1 });
    assert.equal(JSON.stringify(cache), before);
});

test('user selection preserves overrides and falls back when GitHub USERS is empty', () => {
    assert.deepEqual(selectUsers(parseArgs([]), ''), ['LeoHunt', 'hc167', 'u77']);
    assert.deepEqual(selectUsers(parseArgs([]), 'first, second'), ['first', 'second']);
    assert.deepEqual(selectUsers(parseArgs(['--users=explicit']), 'other'), ['explicit']);
    assert.equal(parseArgs(['--rebuild-static', '--skip-discovery']).rebuildStatic, true);
    assert.throws(() => parseArgs(['--invalid']));
});
