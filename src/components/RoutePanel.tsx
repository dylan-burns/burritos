"use client";

import dynamic from "next/dynamic";
import ZipInput from "./ZipInput";
import { Zone, zoneToTransitDays } from "@/lib/shipping";
import { DrivingRoute } from "@/lib/routing";

const Map = dynamic(() => import("./Map"), { ssr: false });

export interface Coords { lat: number; lng: number; }

interface RoutePanelProps {
  from: Coords;
  to: Coords;
  fromZip: string;
  toZip: string;
  fromLabel: string;
  toLabel: string;
  miles: number;
  zone: Zone;
  route: DrivingRoute | null;
  onFromResolve: (lat: number, lng: number, city: string, state: string) => void;
  onToResolve: (lat: number, lng: number, city: string, state: string) => void;
}

export default function RoutePanel({
  from, to, fromZip, toZip, fromLabel, toLabel, miles, zone, route,
  onFromResolve, onToResolve,
}: RoutePanelProps) {
  return (
    <div className="panel" style={{ marginBottom: 24 }}>
      <div className="panel-header">
        <span><span className="num">1</span>Origin & Destination</span>
        <span>Enter ZIP codes</span>
      </div>

      <div className="map-controls">
        <ZipInput
          label="From ZIP"
          initialZip={fromZip}
          initialCaption={fromLabel}
          onResolve={onFromResolve}
        />
        <ZipInput
          label="To ZIP"
          initialZip={toZip}
          initialCaption={toLabel}
          onResolve={onToResolve}
        />
      </div>

      <Map from={from} to={to} route={route} />

      <div className="route-meta">
        <div className="stat">
          <span className="stat-label">Air distance</span>
          <span className="stat-value">{Math.round(miles).toLocaleString()} mi</span>
          {route && (
            <span className="stat-sub">
              {Math.round(route.distanceMiles).toLocaleString()} mi by road · {formatDuration(route.durationHours)}
            </span>
          )}
        </div>
        <div className="stat">
          <span className="stat-label">Shipping Zone</span>
          <span className="stat-value zone">Zone {zone}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Est. Ground Transit</span>
          <span className="stat-value">{zoneToTransitDays(zone)} days</span>
        </div>
      </div>
    </div>
  );
}

function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m drive`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m === 0 ? `${h}h drive` : `${h}h ${m}m drive`;
}
