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
      <div className="mb-[24px]">
        <Header date={data.date} scores={data.scores} />
      </div>

      <div className="flex bg-[#262626] h-[40px]">
        {PRESENTATION_STAGES.map((stageName, idx) => {
          const label =
            stageName.length > 18
              ? stageName.split(" ").slice(1).join(" ")
              : stageName;
          return (
            <div
              key={stageName}
              className={[
                "flex-1 flex items-center justify-center text-[11px] font-bold uppercase text-[#FFFFFF] tracking-[1px] text-center px-[4px]",
                idx === 0 ? "" : "border-l border-[#2E2E2E]",
              ].join(" ")}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="flex flex-1">
        {PRESENTATION_STAGES.map((stageName, idx) => (
          <div
            key={stageName}
            className={[
              "flex-1 overflow-hidden",
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
