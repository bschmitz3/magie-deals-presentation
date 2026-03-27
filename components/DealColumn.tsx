"use client";

import type { Deal } from "@/lib/types";
import DealCard from "@/components/DealCard";

export default function DealColumn({
  stageName,
  deals,
  onDealClick,
}: {
  stageName: string;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}) {
  return (
    <div
      className="h-full overflow-y-auto px-[8px] pt-[8px]"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#333333 transparent",
      }}
      aria-label={`${stageName} deals`}
    >
      <div className="flex flex-col gap-[3px]">
        {deals.map((deal) => (
          <DealCard key={deal.recordId} deal={deal} onClick={onDealClick} />
        ))}
      </div>
    </div>
  );
}
