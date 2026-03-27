"use client";

import Image from "next/image";

export default function Header({ date }: { date: string }) {
  return (
    <div className="flex items-center px-[20px] pt-[16px]">
      <div className="flex items-center gap-[12px]">
        <Image
          src="/images/logo_magie_glass.png"
          alt="magie"
          width={48}
          height={48}
          className="rounded-[12px]"
          priority
        />

        <div className="flex flex-col justify-center">
          <div className="text-[48px] font-black leading-[1] tracking-[-2px] uppercase text-[#FFFFFF]">
            DEALS
          </div>
          <div className="mt-[4px] text-[12px] font-medium uppercase tracking-[1px] text-[#999999]">
            ALL HANDS • {date}
          </div>
        </div>
      </div>
    </div>
  );
}
