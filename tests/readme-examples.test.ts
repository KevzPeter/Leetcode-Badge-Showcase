import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import sharp from 'sharp';

test('all 22 static README references resolve to correctly sized screenshots', async () => {
    const readme = fs.readFileSync('README.md', 'utf8');
    const paths = Array.from(readme.matchAll(/^\[[\w-]+\]: (images\/examples\/[\w-]+\.png)$/gm)).map(match => match[1]);
    assert.equal(paths.length, 22);
    for (const path of paths) {
        assert.ok(fs.existsSync(path), path);
        const metadata = await sharp(path).metadata();
        assert.equal(metadata.format, 'png');
        assert.ok(metadata.width >= 300 && metadata.width <= 400, path);
    }
    const renderedSources = Array.from(readme.matchAll(/<img\s[^>]*src="([^"]+)"/g)).map(match => match[1]);
    // Ignore HTML code examples, which GitHub renders as text rather than images.
    const rendered = readme.replace(/```[\s\S]*?```/g, '');
    const apiImages = Array.from(rendered.matchAll(/<img\s[^>]*src="(https:\/\/leetcode-badge-showcase\.vercel\.app\/api[^\"]+)"/g));
    assert.equal(apiImages.length, 1);
    assert.ok(apiImages[0][1].includes('animated=true'));
    assert.ok(renderedSources.length > 1);
});

test('transparent theme screenshot retains transparent pixels', async () => {
    const { data, info } = await sharp('images/examples/theme-transparent.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixel = (x, y) => data[(y * info.width + x) * info.channels + 3];
    assert.equal(pixel(0, 0), 0);
    assert.equal(pixel(200, 15), 0);
});

test('scheduled updates retain schedule and use scoped commits on the triggering branch', () => {
    const workflow = fs.readFileSync('.github/workflows/update-badge-cache.yaml', 'utf8');
    assert.ok(workflow.includes('cron: "0 0 * * 1"'));
    assert.ok(workflow.includes('USERS: ${{ vars.USERS }}'));
    assert.ok(workflow.includes('ref: ${{ github.ref }}'));
    assert.ok(workflow.includes('git add -- public/cache/base64.txt'));
    assert.ok(workflow.includes('git push origin "HEAD:$TARGET_BRANCH"'));
    assert.ok(!workflow.includes('git add .'));
});
