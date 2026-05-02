"use client";

import { useEffect, useMemo, useState } from "react";
import RoutePanel, { Coords } from "@/components/RoutePanel";
import BurritoCounter from "@/components/BurritoCounter";
import QuotesTable from "@/components/QuotesTable";
import StaticCosts from "@/components/StaticCosts";
import GrandTotal from "@/components/GrandTotal";
import { getDrivingRoute, DrivingRoute } from "@/lib/routing";
import { Carrier, Service, SERVICE_LABELS } from "@/lib/shipping";
import {
  haversineMiles,
  distanceToZone,
  calculateAllQuotes,
  zoneToTransitDays,
  BURRITO_LB,
  BOX_OVERHEAD_LB,
  ICE_PACK_COST,
  ICE_PACKS_PER_BOX,
  INSULATED_BAG_COST,
  BURRITO_COST_EACH,
} from "@/lib/shipping";

export default function Home() {
  const [from, setFrom] = useState<Coords>({ lat: 32.7777, lng: -116.9191 });
  const [to, setTo] = useState<Coords>({ lat: 37.8601, lng: -122.4946 });
  const [fromLabel, setFromLabel] = useState("El Cajon, CA");
  const [toLabel, setToLabel] = useState("Sausalito, CA");
  const [fromZip] = useState("92019");
  const [toZip] = useState("94965");
  const [burritos, setBurritos] = useState(12);
  const [route, setRoute] = useState<DrivingRoute | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRoute(null);
    getDrivingRoute(from, to).then((r) => {
      if (!cancelled) setRoute(r);
    });
    return () => { cancelled = true; };
  }, [from.lat, from.lng, to.lat, to.lng]);

  const miles = useMemo(
    () => haversineMiles(from.lat, from.lng, to.lat, to.lng),
    [from, to]
  );
  const zone = useMemo(() => distanceToZone(miles), [miles]);
  const totalWt = burritos * BURRITO_LB + BOX_OVERHEAD_LB;

  const quotesByService = useMemo(
    () => calculateAllQuotes(zone, totalWt),
    [zone, totalWt]
  );

  const [selected, setSelected] = useState<{ service: Service; carrier: Carrier } | null>(null);
  const selectedQuote = useMemo(() => {
    if (!selected) return null;
    const q = quotesByService[selected.service]?.find((x) => x.carrier === selected.carrier);
    if (!q) return null;
    return {
      cost: q.cost,
      label: `${q.carrier.toUpperCase()} · ${SERVICE_LABELS[q.service][q.carrier]}`,
    };
  }, [selected, quotesByService]);

  const materialCost = ICE_PACK_COST * ICE_PACKS_PER_BOX + INSULATED_BAG_COST;
  const ingredientCost = BURRITO_COST_EACH * burritos;
  const cargoCost = materialCost + ingredientCost;

  // ============ WIZARD ============
  const STEPS = [
    { n: 1, label: "Origin & Destination" },
    { n: 2, label: "The Cargo" },
    { n: 3, label: "Pick Shipping" },
    { n: 4, label: "End-to-End Total" },
  ];
  const [step, setStep] = useState(1);
  const canContinue = step === 3 ? !!selected : true;
  const isLast = step === STEPS.length;

  // ============ WARNINGS ============
  const warnings: React.ReactNode[] = [];

  warnings.push(
    <div key="ingredients" className="warning">
      <div className="icon">🥩</div>
      <div className="text">
        <strong>Cargo: steak + cheese burritos</strong>
        <p>Cooked beef and dairy are TCS foods — must stay below 40°F. Insulated cooler + frozen gel packs holds safe temp for ~24–36 hours. Beyond that, you need dry ice (frozen burritos only) or refrigerated freight (LTL, expensive).</p>
      </div>
    </div>
  );

  if (zone >= 7) {
    warnings.push(
      <div key="danger" className="warning danger">
        <div className="icon">⚠</div>
        <div className="text">
          <strong>Do not ship ground at this distance</strong>
          <p>{zoneToTransitDays(zone)}-day ground transit will spoil cooked steak and cheese. Options: (1) Express overnight only, (2) freeze burritos solid + ship with dry ice (adds ~$30 hazmat fee + special labeling), or (3) refrigerated LTL freight.</p>
        </div>
      </div>
    );
  } else if (zone >= 5) {
    warnings.push(
      <div key="moderate" className="warning">
        <div className="icon">🧊</div>
        <div className="text">
          <strong>Cold chain at the limit</strong>
          <p>{zoneToTransitDays(zone)}-day ground is borderline for cooked beef. Use 2-Day or Express. Pack with frozen gel packs surrounding the burritos in an insulated cooler. Express is the safer call.</p>
        </div>
      </div>
    );
  } else if (zone >= 3) {
    warnings.push(
      <div key="short" className="warning">
        <div className="icon">❄</div>
        <div className="text">
          <strong>Use ice packs even on short hops</strong>
          <p>Ground transit ({zoneToTransitDays(zone)} days) is acceptable IF the burritos start chilled and the cooler stays sealed with sufficient frozen gel packs (~25% of cooler volume). Don't ship over a weekend.</p>
        </div>
      </div>
    );
  }

  if (totalWt > 70) {
    warnings.push(
      <div key="heavy" className="warning">
        <div className="icon">📦</div>
        <div className="text">
          <strong>Heavy package</strong>
          <p>Total weight is {totalWt.toFixed(0)} lb. USPS Ground Advantage caps at 70 lb — quote shown is approximate. Consider splitting into two boxes for better rates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div className="masthead">
          <div className="brand">
            <div className="eyebrow">Bill of Lading // Form B-1996 // Perishable Goods</div>
            <h1>burrito shipping wizard</h1>
            <p className="tagline">Los burritos son muy sabrosos.</p>
          </div>
          <div className="stamp">
            <strong>KEEP REFRIGERATED</strong>
            Beans · Rice · Steak · Cheese
          </div>
        </div>
      </header>

      <div className="stack">
        <div className="wizard-progress">
          <div className="wizard-progress-mobile">
            <div className="wizard-progress-label">
              <span className="wizard-progress-counter">Step {step} of {STEPS.length}</span>
              <strong className="wizard-progress-title">{STEPS[step - 1].label}</strong>
            </div>
            <div className="wizard-progress-track">
              <div
                className="wizard-progress-fill"
                style={{ width: `${(step / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <ol className="wizard-steps">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={`wizard-step ${s.n === step ? "current" : ""} ${s.n < step ? "done" : ""}`}
              >
                <span className="wizard-step-num">{s.n}</span>
                <span className="wizard-step-label">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        {step === 1 && (
          <RoutePanel
            from={from}
            to={to}
            fromZip={fromZip}
            toZip={toZip}
            fromLabel={fromLabel}
            toLabel={toLabel}
            miles={miles}
            zone={zone}
            route={route}
            onFromResolve={(lat, lng, city, state) => {
              setFrom({ lat, lng });
              setFromLabel(`${city}, ${state}`);
            }}
            onToResolve={(lat, lng, city, state) => {
              setTo({ lat, lng });
              setToLabel(`${city}, ${state}`);
            }}
          />
        )}

        {step === 2 && (
          <>
            <StaticCosts />
            <BurritoCounter
              count={burritos}
              onChange={setBurritos}
              materialCost={materialCost}
              ingredientCost={ingredientCost}
            />
          </>
        )}

        {step === 3 && (
          <QuotesTable
            quotesByService={quotesByService}
            warnings={warnings}
            selected={selected}
            onSelect={(service, carrier) => setSelected({ service, carrier })}
          />
        )}

        {step === 4 && (
          <GrandTotal cargoCost={cargoCost} selectedQuote={selectedQuote} />
        )}

        <div className="wizard-nav">
          <button
            type="button"
            className="wizard-btn wizard-back"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            ← Back
          </button>
          {isLast ? (
            <button
              type="button"
              className="wizard-btn wizard-restart"
              onClick={() => { setStep(1); setSelected(null); }}
            >
              Start over
            </button>
          ) : (
            <button
              type="button"
              className="wizard-btn wizard-continue"
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canContinue}
              title={!canContinue ? "Pick a shipping option to continue" : undefined}
            >
              Continue →
            </button>
          )}
        </div>
      </div>

      <div className="footer-note">
        Estimates only · Real rates depend on dimensional weight, surcharges, fuel adjustments, and your account tier · Burrito Shipping Wizard is fictional · Don&apos;t actually ship perishables without proper food-safety packaging
      </div>
    </div>
  );
}
