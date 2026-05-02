// 2026 carrier rates — derived from published rate guides
// (FedEx Jan 5 2026 GRI, UPS Dec 22 2025 GRI, USPS Jan 2026)
// Structure: { base: 1lb cost, perLb: addl per pound }

export type Carrier = "fedex" | "ups" | "usps";
export type Service = "ground" | "twoday" | "express";
export type Zone = 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface RateTier {
  base: number;
  perLb: number;
}

type ZoneRates = Record<Zone, RateTier>;
type CarrierRates = Record<Service, ZoneRates>;

export const RATES: Record<Carrier, CarrierRates> = {
  fedex: {
    ground:  { 2: { base: 11.99, perLb: 0.65 }, 3: { base: 12.45, perLb: 0.80 }, 4: { base: 13.20, perLb: 1.05 }, 5: { base: 14.10, perLb: 1.35 }, 6: { base: 15.40, perLb: 1.65 }, 7: { base: 16.80, perLb: 1.95 }, 8: { base: 18.20, perLb: 2.30 } },
    twoday:  { 2: { base: 24.50, perLb: 1.40 }, 3: { base: 27.20, perLb: 1.75 }, 4: { base: 30.10, perLb: 2.20 }, 5: { base: 33.80, perLb: 2.65 }, 6: { base: 37.40, perLb: 3.10 }, 7: { base: 41.20, perLb: 3.55 }, 8: { base: 45.60, perLb: 4.10 } },
    express: { 2: { base: 38.20, perLb: 2.20 }, 3: { base: 44.50, perLb: 2.80 }, 4: { base: 52.10, perLb: 3.50 }, 5: { base: 60.80, perLb: 4.25 }, 6: { base: 70.40, perLb: 5.00 }, 7: { base: 81.20, perLb: 5.85 }, 8: { base: 92.50, perLb: 6.70 } },
  },
  ups: {
    ground:  { 2: { base: 10.27, perLb: 0.60 }, 3: { base: 10.95, perLb: 0.78 }, 4: { base: 11.80, perLb: 1.00 }, 5: { base: 12.97, perLb: 1.30 }, 6: { base: 14.40, perLb: 1.60 }, 7: { base: 15.80, perLb: 1.90 }, 8: { base: 17.20, perLb: 2.25 } },
    twoday:  { 2: { base: 25.43, perLb: 1.45 }, 3: { base: 27.90, perLb: 1.80 }, 4: { base: 30.80, perLb: 2.25 }, 5: { base: 34.20, perLb: 2.70 }, 6: { base: 37.90, perLb: 3.15 }, 7: { base: 41.80, perLb: 3.60 }, 8: { base: 46.20, perLb: 4.15 } },
    express: { 2: { base: 40.10, perLb: 2.30 }, 3: { base: 46.80, perLb: 2.90 }, 4: { base: 54.20, perLb: 3.60 }, 5: { base: 62.50, perLb: 4.35 }, 6: { base: 72.10, perLb: 5.10 }, 7: { base: 83.50, perLb: 5.95 }, 8: { base: 95.20, perLb: 6.85 } },
  },
  usps: {
    ground:  { 2: { base:  4.50, perLb: 0.45 }, 3: { base:  4.85, perLb: 0.55 }, 4: { base:  5.20, perLb: 0.70 }, 5: { base:  5.60, perLb: 0.85 }, 6: { base:  6.05, perLb: 1.05 }, 7: { base:  6.45, perLb: 1.25 }, 8: { base:  6.70, perLb: 1.45 } },
    twoday:  { 2: { base:  9.85, perLb: 0.95 }, 3: { base: 11.20, perLb: 1.20 }, 4: { base: 12.80, perLb: 1.50 }, 5: { base: 14.60, perLb: 1.80 }, 6: { base: 16.40, perLb: 2.10 }, 7: { base: 18.20, perLb: 2.40 }, 8: { base: 20.10, perLb: 2.75 } },
    express: { 2: { base: 30.50, perLb: 1.90 }, 3: { base: 34.80, perLb: 2.40 }, 4: { base: 40.20, perLb: 3.00 }, 5: { base: 46.50, perLb: 3.65 }, 6: { base: 53.20, perLb: 4.30 }, 7: { base: 60.40, perLb: 5.00 }, 8: { base: 68.20, perLb: 5.75 } },
  },
};

export const SERVICE_LABELS: Record<Service, {
  name: string;
  fedex: string;
  ups: string;
  usps: string;
  transit: string;
}> = {
  ground:  { name: "Regular",  fedex: "FedEx Ground",    ups: "UPS Ground",       usps: "Ground Advantage", transit: "3–5 days" },
  twoday:  { name: "2-Day",    fedex: "FedEx 2Day",      ups: "UPS 2nd Day Air",  usps: "Priority Mail",    transit: "2 days"   },
  express: { name: "Express",  fedex: "FedEx Overnight", ups: "UPS Next Day Air", usps: "Priority Express", transit: "1 day"    },
};

export const CARRIERS: Carrier[] = ["fedex", "ups", "usps"];
export const SERVICES: Service[] = ["express", "twoday", "ground"];

// Burrito physics constants
export const BURRITO_LB = 2.0;
export const BOX_OVERHEAD_LB = 4.0; // insulated cooler + ice packs

// Static unit costs (excluding shipping)
export const ICE_PACK_COST = 1.50;
export const ICE_PACKS_PER_BOX = 2;
export const INSULATED_BAG_COST = 8.00;
export const BURRITO_COST_EACH = 18.00;

// ============ DISTANCE & ZONE ============

export function haversineMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// USPS-style zone bands by miles (approximate)
export function distanceToZone(miles: number): Zone {
  if (miles < 50)   return 2;
  if (miles < 150)  return 3;
  if (miles < 300)  return 4;
  if (miles < 600)  return 5;
  if (miles < 1000) return 6;
  if (miles < 1400) return 7;
  return 8;
}

export function zoneToTransitDays(zone: Zone): string {
  return ({ 2: "1–2", 3: "2–3", 4: "2–3", 5: "3–4", 6: "3–5", 7: "4–6", 8: "5–7" } as const)[zone];
}

// ============ QUOTE CALCULATION ============

export function calculateRate(
  carrier: Carrier,
  service: Service,
  zone: Zone,
  weightLb: number
): number {
  const tier = RATES[carrier][service][zone];
  const billableWt = Math.ceil(weightLb);
  return tier.base + Math.max(0, billableWt - 1) * tier.perLb;
}

export interface Quote {
  carrier: Carrier;
  service: Service;
  cost: number;
  base: number;
  perLb: number;
  extraLb: number;
  isBest: boolean;
}

export function calculateAllQuotes(zone: Zone, weightLb: number): Record<Service, Quote[]> {
  const billableWt = Math.ceil(weightLb);
  const extraLb = Math.max(0, billableWt - 1);
  const result = {} as Record<Service, Quote[]>;
  for (const svc of SERVICES) {
    const quotes = CARRIERS.map((c) => {
      const tier = RATES[c][svc][zone];
      return {
        carrier: c,
        service: svc,
        cost: tier.base + extraLb * tier.perLb,
        base: tier.base,
        perLb: tier.perLb,
        extraLb,
        isBest: false,
      };
    }).sort((a, b) => a.cost - b.cost);
    quotes[0].isBest = true;
    result[svc] = quotes;
  }
  return result;
}

// ============ GEOCODING ============

export interface GeocodeResult {
  lat: number;
  lng: number;
  display: string;
}

export async function geocode(query: string): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
    }
  } catch (e) {
    console.warn("Geocode failed", e);
  }
  return null;
}
