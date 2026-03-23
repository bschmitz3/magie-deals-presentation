"use client";

import Image from "next/image";

export default function ScoreBadge({
  icon,
  label,
  count,
}: {
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <div className="h-[44px] bg-[#1E1E1E] border border-[#3A3A3A] rounded-[12px] px-[20px] flex items-center">
      <div className="flex items-center gap-[10px]">
        <Image src={icon} alt="" aria-hidden="true" width={24} height={24} />
        <div className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[#FFFFFF]">
          {label}
        </div>
        <div className="w-px h-[20px] bg-[#3A3A3A]" />
        <div className="text-[18px] font-bold text-[#FFFFFF]">{count}</div>
      </div>
    </div>
  );
}
