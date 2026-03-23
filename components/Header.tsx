"use client";

import Image from "next/image";

import type { Scores } from "@/lib/types";
import ScoreBadge from "@/components/ScoreBadge";

export default function Header({ date, scores }: { date: string; scores: Scores }) {
  return (
    <div className="flex items-center justify-between px-[40px] pt-[32px]">
      <div className="flex items-center gap-[16px]">
        <Image
          src="/images/logo_magie_glass.png"
          alt="magie"
          width={80}
          height={80}
          className="rounded-[16px]"
          priority
        />

        <div className="flex flex-col justify-center">
          <div className="text-[72px] font-black leading-[1] tracking-[-2px] uppercase text-[#FFFFFF]">
            DEALS
          </div>
          <div className="mt-[6px] text-[14px] font-medium uppercase tracking-[1px] text-[#999999]">
            ALL HANDS • {date}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-[16px]">
        <ScoreBadge icon="/icons/deals.svg" label="DEALS" count={scores.totalDeals} />
        <ScoreBadge
          icon="/icons/customers.svg"
          label="CUSTOMERS"
          count={scores.customers}
        />
        <ScoreBadge icon="/icons/channels.svg" label="CHANNELS" count={scores.channels} />
      </div>
    </div>
  );
}
