"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Header({
  date,
  allStages,
  visibleStages,
  onToggleStage,
}: {
  date: string;
  allStages: string[];
  visibleStages: string[];
  onToggleStage: (stage: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const visibleSet = new Set(visibleStages);

  function selectAll() {
    for (const stage of allStages) {
      if (!visibleSet.has(stage)) onToggleStage(stage);
    }
  }

  function clearAll() {
    const toRemove = allStages.filter((s) => visibleSet.has(s));
    // Keep at least 1
    for (let i = 0; i < toRemove.length - 1; i++) {
      onToggleStage(toRemove[i]);
    }
  }

  return (
    <div className="flex items-center justify-between px-[20px] pt-[16px]">
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

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-[40px] h-[40px] bg-[#1E1E1E] border border-[#3A3A3A] rounded-[10px] cursor-pointer transition-colors duration-150 hover:bg-[#262626]"
          aria-label="Filter columns"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4h18l-7 8.2V18l-4 2V12.2L3 4z"
              fill="#FFFFFF"
            />
          </svg>
        </button>

        <div
          className={[
            "absolute top-[48px] right-0 z-[40] w-[240px] bg-[#1C1C1C] border border-[#3A3A3A] rounded-[12px] p-[12px] transition-all duration-150 origin-top-right",
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none",
          ].join(" ")}
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
        >
          <div className="flex flex-col gap-[2px]">
            {allStages.map((stage) => {
              const checked = visibleSet.has(stage);
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => onToggleStage(stage)}
                  className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] cursor-pointer transition-colors duration-150 hover:bg-[#262626] w-full text-left"
                >
                  <div
                    className={[
                      "w-[16px] h-[16px] rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                      checked
                        ? "bg-[#4ADE80] border-[1.5px] border-[#4ADE80]"
                        : "bg-transparent border-[1.5px] border-[#666666]",
                    ].join(" ")}
                  >
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5L4.2 7.5L8 2.5"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] font-medium text-[#FFFFFF]">
                    {stage}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-[12px] mt-[10px] pt-[10px] border-t border-[#2E2E2E]">
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] font-medium text-[#4ADE80] cursor-pointer hover:underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-medium text-[#4ADE80] cursor-pointer hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
