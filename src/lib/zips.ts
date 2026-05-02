// US ZIP code lookup. Dataset (~1.8 MB raw, ~400 KB gzipped) is fetched
// once on first call and cached for the session.

export interface ZipRecord {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

type ZipMap = Record<string, [number, number, string, string]>;

let cache: Promise<ZipMap> | null = null;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function loadZips(): Promise<ZipMap> {
  if (!cache) {
    cache = fetch(`${BASE_PATH}/data/us-zips.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`zips fetch ${r.status}`);
        return r.json() as Promise<ZipMap>;
      })
      .catch((err) => {
        cache = null; // allow retry on next call
        throw err;
      });
  }
  return cache;
}

export async function lookupZip(zip: string): Promise<ZipRecord | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  const map = await loadZips();
  const row = map[zip];
  if (!row) return null;
  return { lat: row[0], lng: row[1], city: row[2], state: row[3] };
}

// Eagerly warm the cache (call on first input focus to hide latency)
export function prefetchZips(): void {
  loadZips().catch(() => { cache = null; });
}
