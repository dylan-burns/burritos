"use client";

interface GrandTotalProps {
  cargoCost: number;
  shippingCost: number;
}

export default function GrandTotal({ cargoCost, shippingCost }: GrandTotalProps) {
  const total = cargoCost + shippingCost;
  return (
    <div className="panel grand-total-panel">
      <div className="panel-header">
        <span><span className="num">$</span>End-to-End Total</span>
        <span>Cheapest ground</span>
      </div>
      <div className="grand-total-body">
        <div className="grand-total-row">
          <span className="gt-label">Cargo</span>
          <span className="gt-value">${cargoCost.toFixed(2)}</span>
        </div>
        <div className="grand-total-row">
          <span className="gt-label">Shipping</span>
          <span className="gt-value">${shippingCost.toFixed(2)}</span>
        </div>
        <div className="grand-total-row grand-total-final">
          <span className="gt-label">Total</span>
          <span className="gt-value">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
