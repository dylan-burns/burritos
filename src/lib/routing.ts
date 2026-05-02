// Driving route lookup via the public OSRM demo server.
// Free, no key, CORS-friendly; rate-limited to ~1 req/s — fine for an
// interactive form where requests only fire when from/to actually change.

export interface DrivingRoute {
  coordinates: [number, number][]; // [lat, lng] pairs (Leaflet order)
  distanceMiles: number;
  durationHours: number;
}

interface Coords { lat: number; lng: number; }

const cache = new Map<string, Promise<DrivingRoute | null>>();

function key(from: Coords, to: Coords): string {
  // Round to ~110m precision to dedupe near-identical requests
  const r = (n: number) => n.toFixed(3);
  return `${r(from.lat)},${r(from.lng)}|${r(to.lat)},${r(to.lng)}`;
}

export function getDrivingRoute(from: Coords, to: Coords): Promise<DrivingRoute | null> {
  const k = key(from, to);
  const hit = cache.get(k);
  if (hit) return hit;

  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  const promise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`osrm ${r.status}`);
      return r.json();
    })
    .then((data) => {
      const route = data?.routes?.[0];
      if (!route) return null;
      const coords: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
      return {
        coordinates: coords,
        distanceMiles: route.distance * 0.000621371,
        durationHours: route.duration / 3600,
      };
    })
    .catch((err) => {
      console.warn("OSRM route fetch failed:", err);
      cache.delete(k); // allow retry
      return null;
    });

  cache.set(k, promise);
  return promise;
}
