import { AVATAR_COLORS, DOMAIN_MAP } from "./constants";

// ---------------------------------------------------------------------------
// MAINTENANCE NOTE:
// When adding a new logo file to public/logos/, also add the filename (without
// the .png extension) to the AVAILABLE_LOGOS array below. This powers the fuzzy
// matching that automatically resolves deal names to their logo files.
// ---------------------------------------------------------------------------

// All logo filenames available in public/logos/ (without ".png").
export const AVAILABLE_LOGOS: string[] = [
  "180_seguros",
  "99",
  "adaflow",
  "agibank",
  "agrega",
  "asaas",
  "astropay",
  "avenue",
  "banco_bmg",
  "banco_bs2",
  "banco_bv",
  "banco_daycoval",
  "banco_do_brasil",
  "banco_inter",
  "banco_pan",
  "banco_pine",
  "banco_xp",
  "binance",
  "blip",
  "bradesco",
  "bull_cred_tech",
  "c6_bank",
  "capim",
  "caveo",
  "celcoin",
  "cloudwalk",
  "condoconta",
  "conta_azul",
  "conta_simples",
  "contabilizei",
  "cooperforte",
  "cora",
  "estrela_bet",
  "facio",
  "grao_direto",
  "gupshup",
  "ifood",
  "interbank",
  "ipiranga",
  "itau",
  "izi",
  "magalu",
  "mercado_bitcoin",
  "natura",
  "nomad",
  "nstech",
  "onfly",
  "oxpay",
  "passabot",
  "pega_leve",
  "picpay",
  "plin_energia",
  "plugz",
  "porto_seguro",
  "primo_rico",
  "qi_tech",
  "raio_beneficios",
  "rica_alimentos",
  "rodobens",
  "santander",
  "serasa",
  "stark_bank",
  "stone",
  "swap",
  "terra_magna",
  "uy3",
  "vigicred",
  "vivo_pay",
];

const AVAILABLE_LOGOS_SET = new Set(AVAILABLE_LOGOS);

// Deal Name (CSV) -> filename (public/logos) without ".png"
// Keys are matched case-insensitively.
export const LOGO_OVERRIDE_MAP: Record<string, string> = {
  "Banco BV": "banco_bv",
  "Banco BS2": "banco_bs2",
  "Banco Pine": "banco_pine",
  "Banco XP": "banco_xp",
  "Banco Pan": "banco_pan",
  "Banco do Brasil": "banco_do_brasil",
  "Banco Inter": "banco_inter",
  "Banco Daycoval": "banco_daycoval",
  "BMG": "banco_bmg",
  "C6 Bank": "c6_bank",
  "MercadoBitcoin (MB)": "mercado_bitcoin",
  "Grupo Primo (primo rico)": "primo_rico",
  "Natura / Emana Pay": "natura",
  "UY3 (canal BaaS)": "uy3",
  "PlugZ (Semenzato)": "plugz",
  "interbank (peru)": "interbank",
  "180 Seguros": "180_seguros",
  "Grão Direto": "grao_direto",
  "Conta Azul": "conta_azul",
  "Conta Simples": "conta_simples",
  "QI Tech": "qi_tech",
  "Rica Alimentos": "rica_alimentos",
  "Estrela Bet": "estrela_bet",
  "Porto Seguro": "porto_seguro",
  "Plin Energia": "plin_energia",
  "Trigo Dourado": "trigo_dourado",
  "TerraMagna": "terra_magna",
  "Vivo": "vivo_pay",
  "pagaleve": "pega_leve",
  "Rodobank": "rodobens",
  "bull": "bull_cred_tech",
  "CondoConta": "condoconta",
  "Itaú": "itau",
  "Stark Bank/Infra": "stark_bank",
  "Raiô Benfícios": "raio_beneficios",
  "Raiô Benefícios": "raio_beneficios",
};

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function generateSlug(dealName: string): string {
  const trimmed = dealName.trim();
  const overrideKey = Object.keys(LOGO_OVERRIDE_MAP).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase(),
  );

  if (overrideKey) return LOGO_OVERRIDE_MAP[overrideKey];

  // Remove everything after: ( / + : — (keep the left side)
  let base = trimmed;
  const separators = ["(", "/", "+", ":", "—", "–"];
  let cutIndex = Infinity;
  for (const sep of separators) {
    const idx = base.indexOf(sep);
    if (idx !== -1) cutIndex = Math.min(cutIndex, idx);
  }
  if (cutIndex !== Infinity) base = base.slice(0, cutIndex).trim();

  // Normalize:
  // - lowercase
  // - remove accents
  // - spaces => underscore
  // - remove non-alphanumerics except underscore
  base = stripAccents(base).toLowerCase();
  base = base.replace(/\s+/g, "_");
  base = base.replace(/[^a-z0-9_]/g, "");
  base = base.replace(/_+/g, "_").replace(/^_|_$/g, "");

  // --- Fuzzy matching against AVAILABLE_LOGOS ---

  if (AVAILABLE_LOGOS_SET.has(base)) return base;

  // 1. Try removing common suffixes
  const COMMON_SUFFIXES = ["_bank", "_pay", "_tech", "_digital", "_brasil"];
  for (const suffix of COMMON_SUFFIXES) {
    if (base.endsWith(suffix)) {
      const stripped = base.slice(0, -suffix.length);
      if (stripped && AVAILABLE_LOGOS_SET.has(stripped)) return stripped;
    }
  }

  // 2. Check if any available logo starts with the slug
  const startsWithMatch = AVAILABLE_LOGOS.find((logo) => logo.startsWith(base));
  if (startsWithMatch) return startsWithMatch;

  // 3. Check if any available logo contains the slug
  const containsMatch = AVAILABLE_LOGOS.find((logo) => logo.includes(base));
  if (containsMatch) return containsMatch;

  // 4. Check if the slug contains any available logo (longest match first)
  const containedMatch = [...AVAILABLE_LOGOS]
    .sort((a, b) => b.length - a.length)
    .find((logo) => base.includes(logo));
  if (containedMatch) return containedMatch;

  return base;
}

export function getLogoUrl(dealName: string): string {
  const slug = generateSlug(dealName);
  return `/logos/${slug}.png`;
}

export function getFaviconUrl(dealName: string): string | null {
  const key = Object.prototype.hasOwnProperty.call(DOMAIN_MAP, dealName)
    ? dealName
    : Object.keys(DOMAIN_MAP).find((k) => k.toLowerCase() === dealName.trim().toLowerCase());

  if (!key) return null;
  const domain = DOMAIN_MAP[key];
  if (!domain) return null;

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function getAvatarColor(dealName: string): string {
  const seed = hashStringToUint32(dealName);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}

export function getInitials(dealName: string): string {
  const cleaned = dealName.trim();
  if (!cleaned) return "?";

  let out = "";
  for (let i = 0; i < cleaned.length && out.length < 2; i++) {
    const ch = cleaned[i];
    if (/[a-z0-9]/i.test(ch)) out += ch;
  }

  return out.toUpperCase() || "?";
}
