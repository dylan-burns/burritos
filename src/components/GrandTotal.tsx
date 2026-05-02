"use client";

interface GrandTotalProps {
  cargoCost: number;
  selectedQuote: { cost: number; label: string } | null;
}

export default function GrandTotal({ cargoCost, selectedQuote }: GrandTotalProps) {
  const total = cargoCost + (selectedQuote?.cost ?? 0);
  return (
    <div className="panel grand-total-panel">
      <div className="panel-header">
        <span><span className="num">$</span>End-to-End Total</span>
        <span>{selectedQuote ? "Cargo + shipping" : "Pick shipping first"}</span>
      </div>
      <div className="grand-total-body">
        <div className="grand-total-row">
          <span className="gt-label">Cargo</span>
          <span className="gt-value">${cargoCost.toFixed(2)}</span>
        </div>
        <div className="grand-total-row">
          <span className="gt-label">
            Shipping
            {selectedQuote && <span className="gt-sublabel"> · {selectedQuote.label}</span>}
          </span>
          <span className="gt-value">{selectedQuote ? `$${selectedQuote.cost.toFixed(2)}` : "—"}</span>
        </div>
        <div className="grand-total-row grand-total-final">
          <span className="gt-label">Total</span>
          <span className="gt-value">{selectedQuote ? `$${total.toFixed(2)}` : "—"}</span>
        </div>
      </div>
    </div>
  );
}
