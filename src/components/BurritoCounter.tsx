"use client";

import { BURRITO_LB, BOX_OVERHEAD_LB } from "@/lib/shipping";

interface BurritoCounterProps {
  count: number;
  onChange: (n: number) => void;
  materialCost: number;
  ingredientCost: number;
}

export default function BurritoCounter({
  count, onChange, materialCost, ingredientCost,
}: BurritoCounterProps) {
  const cargoWt = count * BURRITO_LB;
  const totalWt = cargoWt + BOX_OVERHEAD_LB;
  const cargoSubtotal = materialCost + ingredientCost;
  const set = (n: number) => onChange(Math.max(1, Math.min(200, Math.floor(n) || 1)));

  return (
    <div className="panel">
      <div className="panel-header">
        <span><span className="num">2</span>The Cargo</span>
        <span>2.0 lb / burrito</span>
      </div>
      <table className="cargo-table">
        <tbody>
          <tr>
            <th>Quantity</th>
            <td className="qty-cell">
              <button className="qty-btn" onClick={() => set(count - 1)} aria-label="Decrease">−</button>
              <input
                type="number"
                className="qty-input"
                value={count}
                min={1}
                max={200}
                onChange={(e) => set(parseInt(e.target.value))}
              />
              <button className="qty-btn" onClick={() => set(count + 1)} aria-label="Increase">+</button>
              <span className="qty-suffix">burritos</span>
            </td>
          </tr>
          <tr>
            <th>Package weight</th>
            <td>
              {totalWt.toFixed(0)} lb
              <span className="row-note">{cargoWt.toFixed(0)} lb burritos + {BOX_OVERHEAD_LB.toFixed(0)} lb cooler</span>
            </td>
          </tr>
          <tr>
            <th>Materials</th>
            <td>${materialCost.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Burritos ({count} × $18)</th>
            <td>${ingredientCost.toFixed(2)}</td>
          </tr>
          <tr className="cargo-total">
            <th>Cargo subtotal</th>
            <td>${cargoSubtotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
