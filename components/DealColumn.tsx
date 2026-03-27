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
    <div className="h-full">
      <div
        className="grid gap-[7px] pt-[16px] px-[6px]"
        style={{
          gridTemplateColumns: "repeat(3, 52px)",
          width: "fit-content",
          margin: "0 auto",
        }}
        aria-label={`${stageName} deals`}
      >
        {deals.map((deal) => (
          <DealCard key={deal.recordId} deal={deal} onClick={onDealClick} />
        ))}
      </div>
    </div>
  );
}
