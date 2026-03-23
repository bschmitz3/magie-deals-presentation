"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { parseCSV } from "@/lib/parseCSV";
import type { PresentationData } from "@/lib/types";

const STORAGE_KEY = "magieDealsPresentationData";

export default function CoverPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [presentationDateISO, setPresentationDateISO] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presentationDate = useMemo(() => {
    // Input type="date" gives YYYY-MM-DD; we convert to dd/mm/yyyy for the app model.
    if (!presentationDateISO) return "";
    const parts = presentationDateISO.split("-");
    if (parts.length !== 3) return "";
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }, [presentationDateISO]);

  const canStart = useMemo(() => {
    return presentationDate.trim().length > 0 && Boolean(selectedFile) && !isSubmitting;
  }, [presentationDate, selectedFile, isSubmitting]);

  async function handleLetsGo() {
    if (!selectedFile) return;
    if (!presentationDate.trim()) return;

    try {
      setIsSubmitting(true);
      const csvText = await selectedFile.text();
      const data: PresentationData = parseCSV(csvText, presentationDate.trim());

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      router.push("/presentation");
    } catch (err) {
      console.error("Failed to start presentation:", err);
      setIsSubmitting(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileName(file ? file.name : "");
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
            <label className="block text-[13px] font-medium text-[#999999]">
              Presentation date
            </label>
            <input
              type="date"
              value={presentationDateISO}
              onChange={(e) => setPresentationDateISO(e.target.value)}
              className="mt-[8px] h-[44px] w-full rounded-[8px] bg-[#FFFFFF] border border-[#DADADA] px-[14px] text-[14px] text-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
            />
          </div>

          <div className="mt-[16px]">
            <button
              type="button"
              onClick={openFilePicker}
              className="h-[44px] w-full rounded-[24px] bg-[#4ADE80] hover:bg-[#3ECF71] text-[14px] font-semibold text-[#FFFFFF] flex items-center justify-center gap-[8px] transition-colors disabled:cursor-not-allowed"
            >
              <Image src="/icons/upload.svg" alt="" aria-hidden="true" width={16} height={16} />
              <span>Upload Hubspot Deals file</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={onFileSelected}
              className="hidden"
            />

            {fileName ? (
              <div className="mt-[8px] text-[12px] text-[#999999] text-center">{fileName}</div>
            ) : null}
          </div>

          <div className="my-[24px] h-px w-full bg-[#3A3A3A]" />

          <button
            type="button"
            onClick={handleLetsGo}
            disabled={!canStart}
            className={[
              "h-[44px] w-full rounded-[24px] text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]",
              canStart
                ? "bg-[#4ADE80] text-[#FFFFFF] hover:bg-[#3ECF71]"
                : "bg-[#3A3A3A] text-[#888888] cursor-not-allowed",
            ].join(" ")}
          >
            Let&apos;s go!
          </button>
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
