import { Site, SiteRole } from "@prisma/client";

// Filter types derived from constants (single source of truth)
export type DateFilter = "今日" | "昨日" | "今週" | "過去7日間" | "過去30日間" | "過去90日間";
export type SatisfactionFilter = "low" | "medium" | "high" | "all";
export type ModeFilter = "PLATFORM" | "WIDGET" | "all";

export interface ConversationReference {
  title: string;
  description: string;
  url: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
  references?: ConversationReference[];
}

export interface ConversationApiLog {
  method: string;
  endpoint: string;
  statusCode: number;
  processingTime: string;
  timestamp: string;
}

export interface ConversationDetails {
  id: string;
  question: string;
  mode: string;
  domain: string;
  timestamp: string;
  cost: string;
  references: number;
  satisfaction: number | null;
  status: string;
  messages: ConversationMessage[];
  apiLogs: ConversationApiLog[];
}

export type InquiryLog = {
  id: string;
  question: string;
  summary: string;
  references: number;
  satisfaction: number | null;
  siteRole: SiteRole;
  domain: string;
  mode: string;
  time: string;
};

export type PageData = Site & {
  // UI-only derived/extended fields
  pageName: string; // duplicate of Site.name for table display
  status: string;
  crawl: string;
  allowCrawl: boolean;
  respectRobots: boolean;
  autoGenerateQA: boolean;
  crawlExclusion: string;
  qaTemplate: string;
};

// Import types for use in interface

export interface InquiryLogFilters {
  dateFilter?: DateFilter;
  domainFilter?: string;
  satisfactionFilter?: SatisfactionFilter;
  modeFilter?: ModeFilter;
}