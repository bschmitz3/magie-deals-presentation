export const PRESENTATION_STAGES = [
  "Lead",
  "First Outreach",
  "Intro Call Scheduled",
  "Qualifying",
  "Later FUP",
  "No Response / Stale",
  "Client Internal Review",
  "Scope Definition",
  "Proposal Sent",
  "Pilot Validation",
  "Contract Negotiation",
  "Closed Won",
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
