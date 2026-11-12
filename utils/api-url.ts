const defaults = {
    theme: 'light', animated: 'false', anon: 'false', border: 'border', json: 'false',
};
const keys = ['username', 'theme', 'filter', 'limit', 'animated', 'anon', 'border', 'json'];

/** Call with validated options on the server; shared with the link generator. */
export function canonicalApiUrl(options: Record<string, unknown>): string {
    const params = new URLSearchParams();
    for (const key of keys) {
        const value = options[key];
        if (value === undefined || value === null || value === '') continue;
        if (String(value) === defaults[key]) continue;
        params.set(key, key === 'limit' ? String(Number(value)) : String(value));
    }
    return `/api?${params.toString()}`;
}
