import { NextResponse } from "next/server";

import { DEAL_CATEGORY_MOCK } from "@/lib/constants";
import type { Deal, DealType, PresentationData } from "@/lib/types";

const HUBSPOT_SEARCH_URL =
  "https://api.hubapi.com/crm/v3/objects/deals/search";
const HUBSPOT_PIPELINES_URL =
  "https://api.hubapi.com/crm/v3/pipelines/deals";

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

interface HubSpotPipelineStage {
  id: string;
  label: string;
  displayOrder: number;
}

interface HubSpotPipeline {
  id: string;
  label: string;
  displayOrder: number;
  stages: HubSpotPipelineStage[];
}

interface HubSpotPipelinesResponse {
  results: HubSpotPipeline[];
}

interface HubSpotDealProperties {
  dealname?: string;
  dealstage?: string;
  closedate?: string;
  hubspot_owner_id?: string;
  amount?: string;
  industry_sizetype?: string;
  pipeline?: string;
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

// Loaded once per cold start — pipeline stages rarely change.
let pipelineCache: {
  pipelineId: string;
  stageIdToLabel: Map<string, string>;
  orderedStageLabels: string[];
} | null = null;

async function fetchDefaultPipeline(token: string) {
  if (pipelineCache) return pipelineCache;

  const res = await fetch(HUBSPOT_PIPELINES_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot pipelines API error ${res.status}: ${text}`);
  }

  const data: HubSpotPipelinesResponse = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No deal pipelines returned from HubSpot");
  }

  // Use the pipeline whose id is "default", falling back to the first one.
  const pipeline =
    data.results.find((p) => p.id === "default") ??
    [...data.results].sort((a, b) => a.displayOrder - b.displayOrder)[0];

  const stageIdToLabel = new Map<string, string>();
  const sortedStages = [...pipeline.stages].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  for (const stage of sortedStages) {
    stageIdToLabel.set(stage.id, stage.label);
  }

  pipelineCache = {
    pipelineId: pipeline.id,
    stageIdToLabel,
    orderedStageLabels: sortedStages.map((s) => s.label),
  };
  return pipelineCache;
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

async function fetchAllDeals(
  token: string,
  pipelineId: string,
): Promise<HubSpotDeal[]> {
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
        "pipeline",
      ],
      filterGroups: [
        {
          filters: [
            {
              propertyName: "pipeline",
              operator: "EQ",
              value: pipelineId,
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
    const pipeline = await fetchDefaultPipeline(token);
    const hubspotDeals = await fetchAllDeals(token, pipeline.pipelineId);

    const deals: Deal[] = [];

    for (const hsDeal of hubspotDeals) {
      const props = hsDeal.properties;
      const dealName = props.dealname?.trim() ?? "";
      if (!dealName) continue;

      const stageId = props.dealstage ?? "";
      const stageLabel = pipeline.stageIdToLabel.get(stageId);
      // Skip deals whose stage isn't part of the resolved pipeline (defensive
      // — shouldn't happen given the pipeline filter on the search request).
      if (!stageLabel) continue;

      const ownerName = OWNER_MAP[props.hubspot_owner_id ?? ""] ?? "";
      const category = resolveCategory(props.industry_sizetype, dealName);

      const seed = hashStringToUint32(dealName);
      const type: DealType = seed % 100 < 70 ? "Customer" : "Channel";

      deals.push({
        recordId: hsDeal.id,
        dealName,
        dealStage: stageLabel,
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
      stages: pipeline.orderedStageLabels,
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
