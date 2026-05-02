"use client";

import { Fragment } from "react";
import { Carrier, Quote, Service, SERVICES, SERVICE_LABELS } from "@/lib/shipping";

interface QuotesTableProps {
  quotesByService: Record<Service, Quote[]>;
  warnings: React.ReactNode;
  selected: { service: Service; carrier: Carrier } | null;
  onSelect: (service: Service, carrier: Carrier) => void;
}

export default function QuotesTable({ quotesByService, warnings, selected, onSelect }: QuotesTableProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span><span className="num">3</span>Pick a Shipping Option</span>
        <span>Tap a row</span>
      </div>
      <table className="rates-grid">
        <thead>
          <tr>
            <th>Carrier</th>
            <th>Service</th>
            <th>Transit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {SERVICES.map((svc) => (
            <Fragment key={svc}>
              <tr className="service-divider">
                <td colSpan={4}>
                  {SERVICE_LABELS[svc].name} · {SERVICE_LABELS[svc].transit}
                </td>
              </tr>
              {quotesByService[svc].map((q) => {
                const isSelected = selected?.service === svc && selected.carrier === q.carrier;
                const cls = [
                  q.isBest ? "best" : "",
                  isSelected ? "selected" : "",
                ].filter(Boolean).join(" ");
                return (
                  <tr
                    key={`${svc}-${q.carrier}`}
                    className={cls}
                    onClick={() => onSelect(svc, q.carrier)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(svc, q.carrier);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <td className="carrier" data-label="Carrier">{q.carrier.toUpperCase()}</td>
                    <td className="service-cell" data-label="Service">{SERVICE_LABELS[svc][q.carrier]}</td>
                    <td className="service-cell" data-label="Transit">{SERVICE_LABELS[svc].transit}</td>
                    <td className="total-cell" data-label="Total">
                      <div className="total-amount">${q.cost.toFixed(2)}</div>
                      <div className="total-breakdown">
                        ${q.base.toFixed(2)} base{q.extraLb > 0 && <> + {q.extraLb} lb × ${q.perLb.toFixed(2)}</>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="warnings-container">{warnings}</div>
    </div>
  );
}
