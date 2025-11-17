// Dashboard Analytics Types

import { SiteRole } from "@prisma/client";

export type RecentQuestion = {
  question: string;
  answer: string;
  time: string;
  status: "resolved" | "pending";
};

export type ModeDistribution = {
  mode: string;
  count: number;
  percentage: number;
};

export type DailyData = {
  date: string;
  value: number;
};

export type MonthlyData = {
  month: string;
  value: number;
  fill: string;
};

export type SiteRoleData = {
  name: SiteRole;
  value: number;
  percentage: number;
  color: string;
};

export type SatisfactionDailyData = {
  date: string;
  value: number;
  count: number;
};

export type AverageSatisfaction = {
  average: number;
  totalRatings: number;
};
