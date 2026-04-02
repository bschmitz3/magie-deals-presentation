"use client";

import { useCallback, useMemo, useState } from "react";

import type { Deal, PresentationData } from "@/lib/types";
import { PRESENTATION_STAGES } from "@/lib/constants";
import Header from "@/components/Header";
import DealColumn from "@/components/DealColumn";
import ClientDetailOverlay from "@/components/ClientDetailOverlay";

const ALL_STAGES = [...PRESENTATION_STAGES];

export default function PresentationBoard({ data }: { data: PresentationData }) {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [visibleStages, setVisibleStages] = useState<string[]>([...ALL_STAGES]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleStage = useCallback((stage: string) => {
    setVisibleStages((prev) => {
      if (prev.includes(stage)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== stage);
      }
      const next = [...ALL_STAGES].filter((s) => prev.includes(s) || s === stage);
      return next;
    });
  }, []);

  const dealsByStage = useMemo(() => {
    const map = new Map<string, Deal[]>();
    for (const stage of PRESENTATION_STAGES) map.set(stage, []);

    for (const deal of data.deals) {
      if (selectedCategory && deal.category !== selectedCategory) continue;
      const list = map.get(deal.dealStage);
      if (list) list.push(deal);
    }

    return map;
  }, [data.deals, selectedCategory]);

  const filteredVisibleStages = useMemo(() => {
    return visibleStages.filter(
      (stage) => (dealsByStage.get(stage)?.length ?? 0) > 0,
    );
  }, [visibleStages, dealsByStage]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden bg-[#141414] flex flex-col">
      <div className="mb-[8px]">
        <Header
          date={data.date}
          allStages={ALL_STAGES}
          visibleStages={visibleStages}
          onToggleStage={toggleStage}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div
        className="grid bg-[#262626] min-h-[36px] px-[20px]"
        style={{ gridTemplateColumns: `repeat(${filteredVisibleStages.length}, 1fr)` }}
      >
        {filteredVisibleStages.map((stageName, idx) => (
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
        style={{ gridTemplateColumns: `repeat(${filteredVisibleStages.length}, 1fr)` }}
      >
        {filteredVisibleStages.map((stageName, idx) => (
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
