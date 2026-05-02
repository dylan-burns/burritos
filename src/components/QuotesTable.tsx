"use client";

import { Fragment } from "react";
import { Quote, Service, SERVICES, SERVICE_LABELS } from "@/lib/shipping";

interface QuotesTableProps {
  quotesByService: Record<Service, Quote[]>;
  warnings: React.ReactNode;
}

export default function QuotesTable({ quotesByService, warnings }: QuotesTableProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span><span className="num">3</span>Carrier Quotes</span>
        <span>Live calc</span>
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
              {quotesByService[svc].map((q) => (
                <tr key={`${svc}-${q.carrier}`} className={q.isBest ? "best" : ""}>
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
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="warnings-container">{warnings}</div>
    </div>
  );
}
