"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Deal } from "@/lib/types";
import {
  getAvatarColor,
  getFaviconUrl,
  getInitials,
  getLogoUrl,
} from "@/lib/logoResolver";

export default function ClientDetailOverlay({
  deal,
  onClose,
}: {
  deal: Deal;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const logoUrl = useMemo(() => getLogoUrl(deal.dealName), [deal.dealName]);
  const faviconUrl = useMemo(() => getFaviconUrl(deal.dealName), [deal.dealName]);
  const tileBg = getAvatarColor(deal.dealName);
  const initials = getInitials(deal.dealName);

  const [currentSrc, setCurrentSrc] = useState<string | null>(logoUrl);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    // Allow CSS transition from "off-screen" to "in view".
    const id = requestAnimationFrame(() => setOpen(true));
    closeBtnRef.current?.focus();
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleLogoError() {
    if (showAvatar) return;

    // First failure: try favicon.
    if (currentSrc === logoUrl) {
      if (faviconUrl) {
        setCurrentSrc(faviconUrl);
        return;
      }
      setShowAvatar(true);
      setCurrentSrc(null);
      return;
    }

    setShowAvatar(true);
    setCurrentSrc(null);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-[40] transition-opacity duration-200 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[
          "fixed top-0 right-0 z-[50] w-[320px] h-[100vh] bg-[#1C1C1C] px-[28px] py-[32px] transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{
          boxShadow: "-8px 0 24px rgba(0,0,0,0.5)",
        }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-[28px] right-[28px] w-[32px] h-[32px] text-[20px] leading-none text-[#999999] hover:text-[#FFFFFF]"
          aria-label="Close overlay"
        >
          ×
        </button>

        <div className="mt-0 mb-[24px]">
          <div className="inline-flex px-[12px] py-[6px] rounded-[6px] bg-[#262626] text-[#FFFFFF] text-[11px] font-semibold uppercase tracking-[1px]">
            {deal.dealStage.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center gap-[14px] mb-[24px]">
          <div className="w-[48px] h-[48px] rounded-[8px] overflow-hidden flex items-center justify-center bg-[#2E2E2E]">
            {showAvatar ? (
              <div
                className="w-full h-full flex items-center justify-center text-[20px] font-bold text-[#FFFFFF]"
                style={{ backgroundColor: tileBg }}
              >
                {initials}
              </div>
            ) : currentSrc ? (
              <img
                src={currentSrc}
                alt={deal.dealName}
                className="w-full h-full object-cover"
                onError={handleLogoError}
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

          <div className="text-[22px] font-bold text-[#FFFFFF]">{deal.dealName}</div>
        </div>

        <div className="h-px w-full bg-[#2E2E2E] mb-[24px]" />

        <div className="flex flex-col gap-[20px]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#666666] font-normal mb-[4px]">
              Category
            </div>
            <div className="text-[15px] font-semibold text-[#FFFFFF]">{deal.category}</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#666666] font-normal mb-[4px]">
              Type
            </div>
            <div className="text-[15px] font-semibold text-[#FFFFFF]">{deal.type}</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.5px] text-[#666666] font-normal mb-[4px]">
              Deal Owner
            </div>
            <div className="text-[15px] font-semibold text-[#FFFFFF]">{deal.dealOwner}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
