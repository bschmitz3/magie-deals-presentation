import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

import {
  AVAILABLE_LOGOS,
  generateSlug,
  LOGO_OVERRIDE_MAP,
} from "../lib/logoResolver";

// Usage:
//   npx tsx scripts/analyze-missing-logos.ts <path-to-hubspot-export.csv>
//
// Exports the latest deals view from HubSpot as CSV (with the "Deal Name" and
// "Deal Stage" columns) and pass it as the first argument.

const csvArg = process.argv[2];
if (!csvArg) {
  console.error(
    "Usage: npx tsx scripts/analyze-missing-logos.ts <path-to-hubspot-export.csv>",
  );
  process.exit(1);
}

const CSV_PATH = resolve(csvArg);
const LOGOS_DIR = join(process.cwd(), "public", "logos");

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

const raw = readFileSync(CSV_PATH, "utf-8");
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
const header = parseCsvLine(lines[0]);
const idxName = header.indexOf("Deal Name");
const idxStage = header.indexOf("Deal Stage");

interface Row {
  name: string;
  stage: string;
}

const rows: Row[] = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  rows.push({ name: cols[idxName], stage: cols[idxStage] });
}

const filesOnDisk = new Set(
  readdirSync(LOGOS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => f.replace(/\.png$/i, "")),
);

const availableSet = new Set(AVAILABLE_LOGOS);

const missingPhysical: { dealName: string; resolvedSlug: string; stage: string }[] = [];
const slugInListNotOnDisk: { dealName: string; resolvedSlug: string; stage: string }[] = [];
const fileExistsButNotInAvailable: string[] = [];
const usedFallback: { dealName: string; resolvedSlug: string; stage: string; via: string }[] = [];
const okMatches: { dealName: string; resolvedSlug: string; stage: string }[] = [];

const overrideKeysLower = new Set(
  Object.keys(LOGO_OVERRIDE_MAP).map((k) => k.toLowerCase()),
);

function describeMatchPath(dealName: string, slug: string): string {
  const trimmed = dealName.trim().toLowerCase();
  if (overrideKeysLower.has(trimmed)) return "override";
  if (availableSet.has(slug)) return "exact slug match";
  return "fuzzy fallback or unmatched";
}

const seenNames = new Set<string>();
for (const row of rows) {
  const dealName = row.name?.trim() ?? "";
  if (!dealName) continue;
  const key = dealName.toLowerCase();
  if (seenNames.has(key)) continue;
  seenNames.add(key);

  const slug = generateSlug(dealName);
  const path = describeMatchPath(dealName, slug);
  const onDisk = filesOnDisk.has(slug);
  const inAvailable = availableSet.has(slug);

  if (!onDisk) {
    missingPhysical.push({ dealName, resolvedSlug: slug, stage: row.stage });
  } else if (!inAvailable) {
    // File exists in public/logos but slug not registered in AVAILABLE_LOGOS.
    // This means generateSlug didn't really hit it via fuzzy — it must have
    // been a coincidental literal slug. Still worth flagging.
    slugInListNotOnDisk.push({ dealName, resolvedSlug: slug, stage: row.stage });
  } else if (path === "fuzzy fallback or unmatched" && !overrideKeysLower.has(key)) {
    // Fuzzy match worked. Note any non-trivial deal-name -> slug transformations.
    if (
      !dealName.toLowerCase().includes(slug) &&
      !slug.includes(dealName.toLowerCase().replace(/[^a-z0-9]/g, ""))
    ) {
      usedFallback.push({
        dealName,
        resolvedSlug: slug,
        stage: row.stage,
        via: path,
      });
    } else {
      okMatches.push({ dealName, resolvedSlug: slug, stage: row.stage });
    }
  } else {
    okMatches.push({ dealName, resolvedSlug: slug, stage: row.stage });
  }
}

for (const file of filesOnDisk) {
  if (!availableSet.has(file)) fileExistsButNotInAvailable.push(file);
}

console.log(`\n=== Total unique deal names in CSV: ${seenNames.size} ===\n`);

console.log(`\n### 1. Logos FISICAMENTE FALTANDO em public/logos/ (${missingPhysical.length})`);
console.log(`Resolveram para um slug que não existe como arquivo .png:\n`);
for (const m of missingPhysical) {
  console.log(`  • "${m.dealName}"  →  ${m.resolvedSlug}.png  [stage: ${m.stage}]`);
}

console.log(`\n### 2. Resoluções via fuzzy fallback (verifique se a logo certa foi pega) (${usedFallback.length})`);
for (const m of usedFallback) {
  console.log(`  • "${m.dealName}"  →  ${m.resolvedSlug}.png  [stage: ${m.stage}]`);
}

console.log(`\n### 3. Logos físicas em public/logos/ NÃO listadas em AVAILABLE_LOGOS (${fileExistsButNotInAvailable.length})`);
console.log(`Estas existem no disco mas o fuzzy matching não pode encontrá-las:\n`);
for (const f of fileExistsButNotInAvailable) {
  console.log(`  • ${f}.png`);
}

console.log(`\n### 4. Sanity: matches OK (${okMatches.length})`);
console.log(`(não imprimindo lista — resolveram via override exata ou slug direto)\n`);
