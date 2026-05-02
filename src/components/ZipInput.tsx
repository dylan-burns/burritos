"use client";

import { useEffect, useState } from "react";
import { lookupZip, prefetchZips } from "@/lib/zips";

interface ZipInputProps {
  label: string;
  initialZip: string;
  initialCaption: string;
  onResolve: (lat: number, lng: number, city: string, state: string) => void;
}

export default function ZipInput({
  label,
  initialZip,
  initialCaption,
  onResolve,
}: ZipInputProps) {
  const [zip, setZip] = useState(initialZip);
  const [caption, setCaption] = useState(initialCaption);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (zip.length !== 5) {
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    lookupZip(zip)
      .then((rec) => {
        if (cancelled) return;
        if (rec) {
          setCaption(`${rec.city}, ${rec.state}`);
          setStatus("idle");
          onResolve(rec.lat, rec.lng, rec.city, rec.state);
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => { cancelled = true; };
    // onResolve intentionally excluded: parent passes inline arrow each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  return (
    <label className="zip-field">
      <span className="zip-label">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        value={zip}
        placeholder="ZIP"
        onFocus={prefetchZips}
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, "").slice(0, 5);
          setZip(next);
        }}
        aria-invalid={status === "error"}
      />
      <span className={`zip-caption ${status}`}>
        {status === "error" && "No record for that ZIP"}
        {status === "loading" && zip.length === 5 && "Looking up…"}
        {status === "idle" && caption}
      </span>
    </label>
  );
}
