# Hilbertos Freight Co. — Burrito Shipping Calculator

A satirical bill-of-lading-themed shipping calculator that estimates the true cost of moving steak-and-cheese burritos across the United States via FedEx, UPS, and USPS, with cold-chain risk warnings, ZIP-to-ZIP routing, and an itemized total.

Live: <https://dylan-burns.github.io/burritos/>

## Stack

- Next.js 15 (App Router, static export) + React 19 + TypeScript
- Leaflet + CARTO basemap, OSRM driving routes
- Bundled US ZIP centroid dataset (~41k entries, GeoNames)

## Develop

```sh
npm install
npm run dev
```

Defaults to <http://localhost:3000> (or `PORT=3737 npm run dev`).

## Build (static export)

```sh
npm run build                                       # outputs to ./out
NEXT_PUBLIC_BASE_PATH=/burritos npm run build       # production-flavored build
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes `out/` to GitHub Pages on every push to `main`. To enable on a fresh fork:

1. Repo Settings → Pages → **Source: GitHub Actions**
2. Push to `main`.

## Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + viewport meta
│   ├── page.tsx            # Home — composes everything, owns state
│   └── globals.css         # All styles (mobile-first)
├── components/
│   ├── RoutePanel.tsx      # ZIP inputs + map + route stats
│   ├── ZipInput.tsx        # 5-digit ZIP input with City/State caption
│   ├── Map.tsx             # Leaflet map (dynamic import, client-only)
│   ├── StaticCosts.tsx     # Materials & per-burrito cost panel
│   ├── BurritoCounter.tsx  # Quantity + computed weight + total cost table
│   └── QuotesTable.tsx     # 9-quote rate table + warnings
└── lib/
    ├── shipping.ts         # Rate data, zone calc, quote logic
    ├── zips.ts             # Lazy-loaded ZIP lookup
    └── routing.ts          # OSRM driving-route fetch + cache
```

## Data attribution

- ZIP centroids: [GeoNames postal codes](https://download.geonames.org/export/zip/) (CC BY 4.0)
- Map tiles: © OpenStreetMap contributors, © CARTO
- Routing: [OSRM demo server](http://project-osrm.org/) (rate-limited; for production traffic, self-host or use a paid routing API)

## Disclaimer

Carrier rates are 2026-published estimates and exclude dimensional weight, surcharges, and account-tier discounts. Hilbertos Freight Co. is fictional. Do not actually ship perishables without proper food-safety packaging.
