import Papa from "papaparse";

import type { Deal, PresentationData } from "./types";
import { DEAL_CATEGORY_MOCK, STAGE_MAPPING } from "./constants";

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function getCsvField(record: Record<string, unknown>, fieldName: string): string {
  // Try exact match first
  const exact = record[fieldName];
  if (typeof exact === "string") return exact;

  // Fallback: case-insensitive header lookup
  const foundKey = Object.keys(record).find((k) => k.toLowerCase() === fieldName.toLowerCase());
  const value = foundKey ? record[foundKey] : undefined;
  return typeof value === "string" ? value : "";
}

function buildStageMappingLowercase(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [raw, mapped] of Object.entries(STAGE_MAPPING)) {
    map[raw.trim().toLowerCase()] = mapped;
  }
  return map;
}

export function parseCSV(csvText: string, presentationDate: string): PresentationData {
  const stageMappingLower = buildStageMappingLowercase();

  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const deals: Deal[] = [];

  for (const row of parsed.data) {
    // PapaParse returns an object where values can be string or unknown.
    const recordId = getCsvField(row, "Record ID");
    const dealName = getCsvField(row, "Deal Name");
    const rawStage = getCsvField(row, "Deal Stage");
    const closeDate = getCsvField(row, "Close Date");
    const dealOwner = getCsvField(row, "Deal owner");
    const amount = getCsvField(row, "Amount");

    const stageNormalized = rawStage.trim().toLowerCase();
    const mappedStage = stageMappingLower[stageNormalized];

    // Filter out deals whose stage isn't part of the 7 presentation columns.
    if (!mappedStage) continue;

    const csvCategory = getCsvField(row, "Category").trim();
    const category =
      csvCategory ||
      DEAL_CATEGORY_MOCK[dealName.toLowerCase()] ||
      "Startups + Midmarket";

    const seed = hashStringToUint32(dealName);
    const type = seed % 100 < 70 ? ("Customer" as const) : ("Channel" as const);

    deals.push({
      recordId,
      dealName,
      dealStage: mappedStage,
      rawStage,
      closeDate,
      dealOwner,
      amount,
      category,
      type,
      logoUrl: "",
    });
  }

  const seen = new Set<string>();
  const deduped = deals.filter((d) => {
    const key = d.dealName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const customers = deduped.filter((d) => d.type === "Customer").length;
  const channels = deduped.length - customers;

  return {
    date: presentationDate,
    deals: deduped,
    scores: {
      totalDeals: deduped.length,
      customers,
      channels,
    },
  };
}
