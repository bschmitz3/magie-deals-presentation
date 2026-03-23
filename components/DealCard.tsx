"use client";

import { useMemo, useState } from "react";

import type { Deal } from "@/lib/types";
import { getAvatarColor, getFaviconUrl, getInitials, getLogoUrl } from "@/lib/logoResolver";

export default function DealCard({
  deal,
  onClick,
}: {
  deal: Deal;
  onClick: (deal: Deal) => void;
}) {
  const logoUrl = useMemo(() => getLogoUrl(deal.dealName), [deal.dealName]);
  const faviconUrl = useMemo(() => getFaviconUrl(deal.dealName), [deal.dealName]);

  type FallbackStage = "logo" | "favicon" | "avatar";
  const [fallbackStage, setFallbackStage] = useState<FallbackStage>("logo");

  function handleError() {
    if (fallbackStage === "logo") {
      if (faviconUrl) setFallbackStage("favicon");
      else setFallbackStage("avatar");
      return;
    }

    if (fallbackStage === "favicon") {
      setFallbackStage("avatar");
    }
  }

  const tileBg = getAvatarColor(deal.dealName);
  const initials = getInitials(deal.dealName);
  const imgSrc = fallbackStage === "logo" ? logoUrl : fallbackStage === "favicon" ? faviconUrl : null;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(deal);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={() => onClick(deal)}
      className="w-[56px] h-[56px] rounded-[10px] overflow-hidden cursor-pointer select-none transition-all duration-150 ease-in-out hover:scale-[1.08] hover:shadow-[0_0_0_2px_#4ADE80]"
    >
      {fallbackStage === "avatar" ? (
        <div
          className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#FFFFFF]"
          style={{ backgroundColor: tileBg }}
        >
          {initials}
        </div>
      ) : imgSrc ? (
        <img
          src={imgSrc}
          alt={deal.dealName}
          className="w-full h-full object-cover"
          onError={() => {
            const url = imgSrc ?? "";
            console.log(`[LOGO FAIL] ${url} for "${deal.dealName}"`);
            handleError();
          }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#FFFFFF]"
          style={{ backgroundColor: tileBg }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
