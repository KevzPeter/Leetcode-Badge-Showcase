type HeaderResponse = { setHeader(name: string, value: string): unknown };

export function cacheSuccess(res: HeaderResponse) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Vercel-CDN-Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');
}

export function noStore(res: HeaderResponse) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
}
