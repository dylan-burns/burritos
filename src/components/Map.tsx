"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { DrivingRoute } from "@/lib/routing";

interface MapProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  route: DrivingRoute | null;
}

function makePinIcon(letter: string, color: string) {
  return L.divIcon({
    html: `<div style="
      width: 38px; height: 38px;
      background: ${color};
      border: 2.5px solid #1f1813;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 3px 3px 0 #1f1813;
      display: flex; align-items: center; justify-content: center;
    "><span style="
      transform: rotate(45deg);
      font-family: 'Bowlby One', serif;
      font-size: 16px;
      color: #faf3e3;
    ">${letter}</span></div>`,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
}

export default function Map({ from, to, route }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const fromMarkerRef = useRef<L.Marker | null>(null);
  const toMarkerRef = useRef<L.Marker | null>(null);
  const straightLineRef = useRef<L.Polyline | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([39.8283, -98.5795], 4);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · routing <a href="http://project-osrm.org/">OSRM</a>',
      subdomains: "abcd",
      maxZoom: 18,
    }).addTo(map);

    fromMarkerRef.current = L.marker([from.lat, from.lng], {
      icon: makePinIcon("A", "#c14a2a"),
    }).addTo(map);

    toMarkerRef.current = L.marker([to.lat, to.lng], {
      icon: makePinIcon("B", "#5a7042"),
    }).addTo(map);

    straightLineRef.current = L.polyline(
      [[from.lat, from.lng], [to.lat, to.lng]],
      { color: "#1f1813", weight: 2, opacity: 0.4, dashArray: "6, 6" }
    ).addTo(map);

    map.fitBounds(L.latLngBounds([
      [from.lat, from.lng],
      [to.lat, to.lng],
    ]).pad(0.3));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    fromMarkerRef.current?.setLatLng([from.lat, from.lng]);
    toMarkerRef.current?.setLatLng([to.lat, to.lng]);
    straightLineRef.current?.setLatLngs([
      [from.lat, from.lng],
      [to.lat, to.lng],
    ]);
  }, [from.lat, from.lng, to.lat, to.lng]);

  useEffect(() => {
    if (!mapRef.current) return;
    routeLineRef.current?.remove();
    routeLineRef.current = null;
    if (route && route.coordinates.length > 1) {
      routeLineRef.current = L.polyline(route.coordinates, {
        color: "#c14a2a",
        weight: 4,
        opacity: 0.85,
      }).addTo(mapRef.current);
      mapRef.current.fitBounds(routeLineRef.current.getBounds().pad(0.15));
    } else {
      mapRef.current.fitBounds(L.latLngBounds([
        [from.lat, from.lng],
        [to.lat, to.lng],
      ]).pad(0.3));
    }
  }, [route, from.lat, from.lng, to.lat, to.lng]);

  return <div ref={containerRef} className="map-wrapper" />;
}
