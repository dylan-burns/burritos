"use client";

import { ICE_PACK_COST, ICE_PACKS_PER_BOX, INSULATED_BAG_COST, BURRITO_COST_EACH } from "@/lib/shipping";

export default function StaticCosts() {
  const items = [
    { label: "Disposable ice packs", value: `$${ICE_PACK_COST.toFixed(2)} × ${ICE_PACKS_PER_BOX}` },
    { label: "Insulated freezer bag", value: `$${INSULATED_BAG_COST.toFixed(2)}` },
    { label: "Cost per burrito", value: `$${BURRITO_COST_EACH.toFixed(2)}` },
  ];

  return (
    <div className="panel static-costs-panel">
      <div className="panel-header">
        <span><span className="num">★</span>Static Costs</span>
        <span>Per shipment</span>
      </div>
      <div className="static-costs-list">
        {items.map((it) => (
          <div className="static-cost-row" key={it.label}>
            <span className="static-cost-label">{it.label}</span>
            <span className="static-cost-value">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
