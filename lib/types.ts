export type DealType = "Customer" | "Channel";

export interface Deal {
  recordId: string;
  dealName: string;
  dealStage: string;
  rawStage: string;
  closeDate: string;
  dealOwner: string;
  amount: string;
  category: string;
  type: DealType;
  logoUrl: string;
}

export interface Scores {
  totalDeals: number;
  customers: number;
  channels: number;
}

export interface PresentationData {
  date: string;
  deals: Deal[];
  scores: Scores;
}
