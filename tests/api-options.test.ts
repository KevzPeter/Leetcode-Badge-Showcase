import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalApiUrl } from '../utils/api-url';
import { validationSchema } from '../utils/validation.schema';
import { cacheSuccess, noStore } from '../utils/cache-policy';

function canonical(query: Record<string, unknown>) {
    const { error, value } = validationSchema.validate(query);
    assert.ifError(error);
    return canonicalApiUrl(value);
}

test('defaults, ignored parameters, order and numeric spellings converge', () => {
    assert.equal(canonical({ username: 'MixedCase' }), '/api?username=MixedCase');
    assert.equal(canonical({ username: 'MixedCase', theme: 'light', animated: 'false', anon: 'false', border: 'border', json: 'false', cacheBust: '123' }), '/api?username=MixedCase');
    assert.equal(canonical({ limit: '04', theme: 'dark', username: 'MixedCase' }), '/api?username=MixedCase&theme=dark&limit=4');
});

test('meaningful options and encoded usernames survive without open redirects', () => {
    const url = canonical({ username: '//example.com/a?b#c', theme: 'transparent', filter: 'annual', limit: 8, animated: 'true', anon: 'true', border: 'no-border', json: 'true' });
    assert.equal(new URL(url, 'https://local.test').origin, 'https://local.test');
    assert.equal(new URL(url, 'https://local.test').searchParams.get('username'), '//example.com/a?b#c');
    for (const part of ['theme=transparent', 'filter=annual', 'limit=8', 'animated=true', 'anon=true', 'border=no-border', 'json=true']) assert.ok(url.includes(part));
    assert.equal(canonical(Object.fromEntries(new URL(url, 'https://local.test').searchParams)), url);
});

test('invalid and duplicate known options fail validation', () => {
    for (const query of [{ username: ['a', 'b'] }, { username: 'a', theme: ['dark', 'light'] }, { username: 'a', limit: 0 }, { username: 'a', limit: 501 }, { username: 'a', animated: 'yes' }]) {
        assert.ok(validationSchema.validate(query).error);
    }
});

test('success freshness is seven days and error policy overrides both caches', () => {
    const headers = {};
    const res = { setHeader: (key, value) => { headers[key] = value; } };
    cacheSuccess(res);
    assert.equal(headers['Cache-Control'], 'public, max-age=604800');
    assert.equal(headers['Vercel-CDN-Cache-Control'], 's-maxage=604800, stale-while-revalidate=86400');
    noStore(res);
    assert.equal(headers['Cache-Control'], 'no-store');
    assert.equal(headers['Vercel-CDN-Cache-Control'], 'no-store');
});
