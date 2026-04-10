import { NextResponse } from "next/server";

import {
  STAGE_MAPPING,
  PRESENTATION_STAGES,
  DEAL_CATEGORY_MOCK,
} from "@/lib/constants";
import type { Deal, DealType, PresentationData } from "@/lib/types";

const HUBSPOT_SEARCH_URL =
  "https://api.hubapi.com/crm/v3/objects/deals/search";

const STAGE_ID_MAP: Record<string, string> = {
  "1316011864": "Lead",
  "1316011865": "First Outreach",
  "1316011866": "Intro Call Scheduled",
  "1319773732": "Qualifying",
  "1316011868": "Client Internal Review",
  "1322407809": "scope definition",
  "1331736494": "Pilot Validation",
  "1315985513": "Closed Won (Integration)",
  "1316011869": "Proposal Sent",
  "1316011870": "Contract Negotiation",
  "1319166020": "Pilot started",
  "1319162148": "Scaling",
  "1315985514": "Closed Lost",
  "1318245706": "No Response / Stale",
  "1319650927": "Later FUP",
};

const OWNER_MAP: Record<string, string> = {
  "87637041": "Pedro Castro",
  "87637081": "Luiz Ramalho",
  "88812417": "Leonardo Rosa",
  "89148785": "Luiza Impellizieri",
  "89838073": "Bruno Schmitz",
  "89838104": "Thiago Vaccaro",
};

const CATEGORY_API_MAP: Record<string, string> = {
  Enterprise: "Enterprise",
  Startup: "Startup // Midmarket",
  Middle: "Channels",
};

const PRESENTATION_STAGES_SET = new Set(
  PRESENTATION_STAGES.map((s) => s.toLowerCase()),
);

function buildStageMappingLowercase(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [raw, mapped] of Object.entries(STAGE_MAPPING)) {
    map[raw.trim().toLowerCase()] = mapped;
  }
  return map;
}

function hashStringToUint32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function todayDdMmYyyy(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

interface HubSpotDealProperties {
  dealname?: string;
  dealstage?: string;
  closedate?: string;
  hubspot_owner_id?: string;
  amount?: string;
  industry_sizetype?: string;
}

interface HubSpotDeal {
  id: string;
  properties: HubSpotDealProperties;
}

interface HubSpotSearchResponse {
  total: number;
  results: HubSpotDeal[];
  paging?: {
    next?: {
      after: string;
    };
  };
}

async function fetchAllDeals(token: string): Promise<HubSpotDeal[]> {
  const allDeals: HubSpotDeal[] = [];
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      limit: 200,
      properties: [
        "dealname",
        "dealstage",
        "closedate",
        "hubspot_owner_id",
        "amount",
        "industry_sizetype",
      ],
      filterGroups: [
        {
          filters: [
            {
              propertyName: "dealstage",
              operator: "NEQ",
              value: "1318245705",
            },
          ],
        },
      ],
    };

    if (after) {
      body.after = after;
    }

    const res = await fetch(HUBSPOT_SEARCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HubSpot API error ${res.status}: ${text}`);
    }

    const data: HubSpotSearchResponse = await res.json();
    allDeals.push(...data.results);
    after = data.paging?.next?.after;
  } while (after);

  return allDeals;
}

function resolveCategory(
  industrySizeType: string | undefined,
  dealName: string,
): string {
  if (industrySizeType) {
    const mapped = CATEGORY_API_MAP[industrySizeType];
    if (mapped) return mapped;
  }

  const mockCategory = DEAL_CATEGORY_MOCK[dealName.toLowerCase()];
  if (mockCategory) return mockCategory;

  return "Startup // Midmarket";
}

export async function GET() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "HUBSPOT_ACCESS_TOKEN is not configured. Add it to .env.local to enable HubSpot integration.",
      },
      { status: 500 },
    );
  }

  try {
    const hubspotDeals = await fetchAllDeals(token);
    const stageMappingLower = buildStageMappingLowercase();

    const deals: Deal[] = [];

    for (const hsDeal of hubspotDeals) {
      const props = hsDeal.properties;
      const dealName = props.dealname?.trim() ?? "";
      if (!dealName) continue;

      const stageId = props.dealstage ?? "";
      const stageLabel = STAGE_ID_MAP[stageId];
      if (!stageLabel) continue;

      const presentationStage =
        stageMappingLower[stageLabel.trim().toLowerCase()];
      if (
        !presentationStage ||
        !PRESENTATION_STAGES_SET.has(presentationStage.toLowerCase())
      ) {
        continue;
      }

      const ownerName = OWNER_MAP[props.hubspot_owner_id ?? ""] ?? "";
      const category = resolveCategory(props.industry_sizetype, dealName);

      const seed = hashStringToUint32(dealName);
      const type: DealType = seed % 100 < 70 ? "Customer" : "Channel";

      deals.push({
        recordId: hsDeal.id,
        dealName,
        dealStage: presentationStage,
        rawStage: stageLabel,
        closeDate: props.closedate ?? "",
        dealOwner: ownerName,
        amount: props.amount ?? "",
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

    const data: PresentationData = {
      date: todayDdMmYyyy(),
      deals: deduped,
      scores: {
        totalDeals: deduped.length,
        customers,
        channels,
      },
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("HubSpot API fetch failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch deals from HubSpot",
      },
      { status: 500 },
    );
  }
}
