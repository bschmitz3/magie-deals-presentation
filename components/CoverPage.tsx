"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { parseCSV } from "@/lib/parseCSV";
import type { PresentationData } from "@/lib/types";

const STORAGE_KEY = "magieDealsPresentationData";

function todayDdMmYyyy(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function CoverPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleHubSpotSync() {
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

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    try {
      setIsParsing(true);
      setError(null);

      const csvText = await file.text();
      const data: PresentationData = parseCSV(csvText, todayDdMmYyyy());

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      router.push("/presentation");
    } catch (err) {
      console.error("CSV parsing failed:", err);
      setError(err instanceof Error ? err.message : "Failed to parse CSV");
      setIsParsing(false);
    }
  }

  const isLoading = isSyncing || isParsing;

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

          <div className="mt-[32px] flex flex-col gap-[12px]">
            {/* HubSpot Sync Button */}
            <button
              type="button"
              onClick={handleHubSpotSync}
              disabled={isLoading}
              className="h-[44px] w-full rounded-[24px] bg-[#FF7A59] hover:bg-[#e86c4e] text-[14px] font-semibold text-[#FFFFFF] flex items-center justify-center gap-[8px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <span>Sync from HubSpot</span>
                </>
              )}
            </button>

            {/* "or" divider */}
            <div className="flex items-center gap-[12px]">
              <div className="flex-1 h-px bg-[#3A3A3A]" />
              <span className="text-[12px] text-[#666666] select-none">
                or
              </span>
              <div className="flex-1 h-px bg-[#3A3A3A]" />
            </div>

            {/* CSV Upload Button (fallback) */}
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isLoading}
              className="h-[44px] w-full rounded-[24px] bg-[#4ADE80] hover:bg-[#3ECF71] text-[14px] font-semibold text-[#FFFFFF] flex items-center justify-center gap-[8px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isParsing ? (
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
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Image
                    src="/icons/upload.svg"
                    alt=""
                    aria-hidden="true"
                    width={16}
                    height={16}
                  />
                  <span>Upload Hubspot Deals file</span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={onFileSelected}
              className="hidden"
            />
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
