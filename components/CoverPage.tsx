"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { PresentationData } from "@/lib/types";

const STORAGE_KEY = "magieDealsPresentationData";

export default function CoverPage() {
  const router = useRouter();

  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLetsGo() {
    try {
      setIsSyncing(true);
      setError(null);

      const res = await fetch("/api/hubspot/deals");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ?? `Failed to sync from HubSpot (${res.status})`,
        );
      }

      const data: PresentationData = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      router.push("/presentation");
    } catch (err) {
      console.error("HubSpot sync failed:", err);
      setError(err instanceof Error ? err.message : "Sync failed");
      setIsSyncing(false);
    }
  }

  return (
    <div className="min-h-[100vh] bg-[#141414] flex items-center justify-center">
      <div className="max-w-[960px] w-full px-[64px] py-[56px] bg-[#1C1C1C] rounded-[24px] flex gap-[40px]">
        <div className="w-[55%]">
          <div>
            <Image
              src="/icons/logo_magie_cover_form.svg"
              alt="magie"
              width={160}
              height={32}
              priority
              className="h-[32px] w-auto"
            />
          </div>

          <h1 className="mt-[24px] text-[28px] font-bold leading-[1.2] text-[#FFFFFF]">
            B2B Deal Presentation
          </h1>

          <div className="mt-[32px]">
            <button
              type="button"
              onClick={handleLetsGo}
              disabled={isSyncing}
              className="h-[44px] w-full rounded-[24px] bg-[#4ADE80] hover:bg-[#3ECF71] text-[14px] font-semibold text-[#FFFFFF] flex items-center justify-center gap-[8px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSyncing ? (
                <>
                  <svg
                    className="animate-spin h-[16px] w-[16px]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8h2a6 6 0 0 1 10.24-4.24L10 6h6V0l-2.35 2.35zM14 8a6 6 0 0 1-10.24 4.24L6 10H0v6l2.35-2.35A7.96 7.96 0 0 0 8 16c4.42 0 8-3.58 8-8h-2z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Let&apos;s go!</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-[12px] text-[12px] text-[#EF4444] text-center">
              {error}
            </div>
          )}
        </div>

        <div className="w-[45%] flex items-center justify-center">
          <Image
            src="/images/cover_magie_logo.png"
            alt="Magie hat"
            width={430}
            height={429}
            priority
            className="w-[300px] h-auto"
          />
        </div>
      </div>
    </div>
  );
}
