"use client";

import { ICE_PACK_COST, ICE_PACKS_PER_BOX, INSULATED_BAG_COST, BURRITO_COST_EACH } from "@/lib/shipping";

export default function StaticCosts() {
  return (
    <p className="static-costs-line">
      <em>Static costs per shipment:</em>{" "}
      ice packs (${ICE_PACK_COST.toFixed(2)} × {ICE_PACKS_PER_BOX}), insulated bag (${INSULATED_BAG_COST.toFixed(0)}),
      and ${BURRITO_COST_EACH.toFixed(0)} per burrito to actually make the thing.
    </p>
  );
}
