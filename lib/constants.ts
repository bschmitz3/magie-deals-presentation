export const PRESENTATION_STAGES = [
  "Lead",
  "First Outreach",
  "Intro Call Scheduled",
  "Qualifying",
  "Client Internal Review",
  "Scope Definition",
  "Proposal Sent",
  "Pilot Validation",
  "Contract Negotiation",
  "Closed Won",
  "Later FUP",
  "No Response / Stale",
] as const;

export const STAGE_MAPPING: Record<string, string> = {
  "Lead": "Lead",
  "First Outreach": "First Outreach",
  "Intro Call Scheduled": "Intro Call Scheduled",
  "Qualifying": "Qualifying",
  "Later FUP": "Later FUP",
  "No Response / Stale": "No Response / Stale",
  "Client Internal Review": "Client Internal Review",
  "scope definition": "Scope Definition",
  "Contract Negotiation": "Contract Negotiation",
  "Proposal Sent": "Proposal Sent",
  "Closed Won (Integration)": "Closed Won",
  "Pilot Validation": "Pilot Validation",
};

export const CATEGORIES = [
  "Fintech",
  "Insurance",
  "Retail",
  "Logistics",
  "Agritech",
  "SaaS",
  "Banking",
  "Payments",
] as const;

// Used as a fallback when GitHub logo lookup fails.
// Keys should match the `dealName` values coming from the CSV.
export const DOMAIN_MAP: Record<string, string> = {
  // From the styleguide examples
  "99": "99app.com",
  "99 PAY": "99app.com",
  ifood: "ifood.com.br",
  "iFood": "ifood.com.br",
  Itaú: "itau.com.br",
  "Banco Inter": "bancointer.com.br",
  "Interbank (Peru)": "interbank.pe",
  "interbank (peru)": "interbank.pe",
  "interbank": "interbank.com.pe",
  "Magalu (Luiza)": "magazineluiza.com.br",
  "Magalu": "magazineluisa.com.br",
  "Banco BV": "bv.com.br",
  "Banco BS2": "bs2.com.br",
  "Porto Seguro": "portoseguro.com.br",
  Natura: "natura.com.br",
  "Natura / Emana Pay": "natura.com.br",
  "Emana Pay": "emanapay.com.br",
  "MercadoBitcoin (MB)": "mercadobitcoin.com.br",
  "MercadoBitcoin": "mercadobitcoin.com.br",
  "PlugZ (Semenzato)": "plugz.com.br",
  PlugZ: "plugz.com.br",
  "UY3 (canal BaaS)": "uy3.com.br",
  UY3: "uy3.com.br",
  "Grupo Primo (primo rico)": "primorico.com.br",
  "Grupo Primo": "primorico.com.br",
  "CRM Bonus + Havan: debt collection": "crmbonus.com.br",
  "CRM Bonus": "crmbonus.com.br",
  Havan: "havan.com.br",

  // Additional common companies for better favicon fallback coverage
  Nubank: "nubank.com.br",
  PicPay: "picpay.com",
  Stone: "stone.com.br",
  PagSeguro: "pagseguro.com.br",
  Bradesco: "bradesco.com.br",
  Santander: "santander.com.br",
  "Banco do Brasil": "bb.com.br",
  Caixa: "caixa.gov.br",
  "BTG Pactual": "btgpactual.com",
  "XP Investimentos": "xp.com.br",
  XP: "xp.com.br",
  "Mercado Pago": "mercadopago.com.br",
  "Mercado Livre": "mercadolivre.com.br",
  "Itaú Unibanco": "itau.com.br",
  "Itaú BBA": "itau.com.br",
  "Banco Pine": "bancopine.com.br",
  "PagBank": "pagbank.com.br",
  "Ebanx": "ebanx.com",
  "Wirecard": "wirecard.com",
  "Rappi": "rappi.com.br",
  "Amazon": "amazon.com",
  "Uber": "uber.com",
  OLX: "olx.com.br",
  "Magpie Deals": "magpie.com",
  "Yampi": "yampi.com.br",
  "Shopee": "shopee.com.br",
  "iZettle": "izettle.com",
  "Cielo": "cielo.com.br",
  "C6 Bank": "c6bank.com.br",
};

export const CATEGORY_OPTIONS = ["Enterprise", "Startup // Midmarket", "Channels"] as const;

const buildCategoryMock = (
  entries: [string, string][],
): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const [name, cat] of entries) map[name.toLowerCase()] = cat;
  return map;
};

export const DEAL_CATEGORY_MOCK: Record<string, string> = buildCategoryMock([
  // Enterprise
  ["Itaú", "Enterprise"],
  ["Bradesco", "Enterprise"],
  ["Santander", "Enterprise"],
  ["Banco do Brasil", "Enterprise"],
  ["Banco BV", "Enterprise"],
  ["Banco Pan", "Enterprise"],
  ["Banco Inter", "Enterprise"],
  ["Banco BS2", "Enterprise"],
  ["Banco Pine", "Enterprise"],
  ["Banco XP", "Enterprise"],
  ["Banco Daycoval", "Enterprise"],
  ["Banco Original", "Enterprise"],
  ["Banco Safra", "Enterprise"],
  ["Porto Seguro", "Enterprise"],
  ["Magalu", "Enterprise"],
  ["Vivo", "Enterprise"],
  ["Natura / Emana Pay", "Enterprise"],
  ["ifood", "Enterprise"],
  ["Stone", "Enterprise"],
  ["Serasa", "Enterprise"],
  ["PicPay", "Enterprise"],
  ["PagBank", "Enterprise"],
  ["C6 Bank", "Enterprise"],
  ["Agibank", "Enterprise"],
  ["BMG", "Enterprise"],
  ["Banrisul", "Enterprise"],
  ["BBVA", "Enterprise"],
  ["Ipiranga", "Enterprise"],
  ["Neon", "Enterprise"],

  // Startup // Midmarket
  ["Caveo", "Startup // Midmarket"],
  ["Capim", "Startup // Midmarket"],
  ["Cloudwalk", "Startup // Midmarket"],
  ["Conta Azul", "Startup // Midmarket"],
  ["Conta Simples", "Startup // Midmarket"],
  ["Contabilizei", "Startup // Midmarket"],
  ["Cora", "Startup // Midmarket"],
  ["Nomad", "Startup // Midmarket"],
  ["Onfly", "Startup // Midmarket"],
  ["TerraMagna", "Startup // Midmarket"],
  ["Binance", "Startup // Midmarket"],
  ["MercadoBitcoin (MB)", "Startup // Midmarket"],
  ["Avenue", "Startup // Midmarket"],
  ["Estrela Bet", "Startup // Midmarket"],
  ["QI Tech", "Startup // Midmarket"],
  ["Grão Direto", "Startup // Midmarket"],
  ["Rica Alimentos", "Startup // Midmarket"],
  ["Plin Energia", "Startup // Midmarket"],
  ["CondoConta", "Startup // Midmarket"],
  ["Astropay", "Startup // Midmarket"],
  ["bull", "Startup // Midmarket"],
  ["izi", "Startup // Midmarket"],
  ["180 Seguros", "Startup // Midmarket"],
  ["pagaleve", "Startup // Midmarket"],
  ["Asaas", "Startup // Midmarket"],
  ["Facio", "Startup // Midmarket"],
  ["Fidexa", "Startup // Midmarket"],
  ["MercadoPago", "Startup // Midmarket"],
  ["DuoGourmet", "Startup // Midmarket"],
  ["Hotmart", "Startup // Midmarket"],
  ["MidWay", "Startup // Midmarket"],
  ["RecargaPay", "Startup // Midmarket"],
  ["Techne", "Startup // Midmarket"],
  ["Stark Bank/Infra", "Startup // Midmarket"],
  ["Raiô Benfícios", "Startup // Midmarket"],
  ["Real Bem", "Startup // Midmarket"],
  ["Remessa Online", "Startup // Midmarket"],
  ["Ume", "Startup // Midmarket"],
  ["Zro Bank", "Startup // Midmarket"],
  ["Celcoin", "Startup // Midmarket"],
  ["Cooperforte", "Startup // Midmarket"],

  // Channels
  ["Adaflow", "Channels"],
  ["Blip", "Channels"],
  ["nstech", "Channels"],
  ["Swap", "Channels"],
  ["PlugZ (Semenzato)", "Channels"],
  ["Oxpay", "Channels"],
  ["Passabot", "Channels"],
  ["Gupshup", "Channels"],
  ["UY3 (BaaS)", "Channels"],
  ["Rodobank", "Channels"],
  ["Interbank (Peru)", "Channels"],
  ["Grupo Primo (primo rico)", "Channels"],
  ["Vigicred", "Channels"],
  ["Bemobi / Paytime", "Channels"],
]);

export const AVATAR_COLORS = [
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#14B8A6", // teal
  "#3B82F6", // blue
  "#A855F7", // purple
] as const;
