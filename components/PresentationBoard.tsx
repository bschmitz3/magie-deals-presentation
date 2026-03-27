"use client";

import { useMemo, useState } from "react";

import type { Deal, PresentationData } from "@/lib/types";
import { PRESENTATION_STAGES } from "@/lib/constants";
import Header from "@/components/Header";
import DealColumn from "@/components/DealColumn";
import ClientDetailOverlay from "@/components/ClientDetailOverlay";

export default function PresentationBoard({ data }: { data: PresentationData }) {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const dealsByStage = useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const stage of PRESENTATION_STAGES) map.set(stage, []);

    for (const deal of data.deals) {
      const list = map.get(deal.dealStage);
      if (list) list.push(deal);
    }

    return map;
  }, [data.deals]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden bg-[#141414] flex flex-col">
      <div className="mb-[8px]">
        <Header date={data.date} />
      </div>

      <div
        className="grid bg-[#262626] min-h-[36px] px-[20px]"
        style={{ gridTemplateColumns: `repeat(${PRESENTATION_STAGES.length}, 1fr)` }}
      >
        {PRESENTATION_STAGES.map((stageName, idx) => (
          <div
            key={stageName}
            className={[
              "flex items-center justify-center text-[10px] font-bold uppercase text-[#FFFFFF] tracking-[0.5px] text-center px-[2px] py-[6px] leading-tight",
              idx === 0 ? "" : "border-l border-[#2E2E2E]",
            ].join(" ")}
          >
            {stageName}
          </div>
        ))}
      </div>

      <div
        className="grid flex-1 min-h-0 overflow-y-auto px-[20px]"
        style={{ gridTemplateColumns: `repeat(${PRESENTATION_STAGES.length}, 1fr)` }}
      >
        {PRESENTATION_STAGES.map((stageName, idx) => (
          <div
            key={stageName}
            className={[
              "overflow-hidden",
              idx === 0 ? "" : "border-l border-[#2E2E2E]",
            ].join(" ")}
          >
            <DealColumn
              stageName={stageName}
              deals={dealsByStage.get(stageName) ?? []}
              onDealClick={(deal) => setSelectedDeal(deal)}
            />
          </div>
        ))}
      </div>

      {selectedDeal ? (
        <ClientDetailOverlay
          key={selectedDeal.recordId}
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      ) : null}
    </div>
  );
}
