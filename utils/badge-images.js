const sharp = require('sharp');

// Keep runtime misses and scheduled cache updates on the same encoding policy.
const BADGE_SIZE = 96;
const LOGO_SIZE = 72;

async function encodeStaticImage(data, logo = false) {
    const size = logo ? LOGO_SIZE : BADGE_SIZE;
    const buffer = await sharp(data)
        .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    return `data:image/webp;base64,${buffer.toString('base64')}`;
}

async function encodeGifImage(data) {
    const buffer = await sharp(data, { animated: true })
        .resize({ width: 48, height: 48 }).gif().toBuffer();
    return `data:image/gif;base64,${buffer.toString('base64')}`;
}

module.exports = { BADGE_SIZE, LOGO_SIZE, encodeStaticImage, encodeGifImage };
