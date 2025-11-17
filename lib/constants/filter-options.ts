export const DATE_FILTER_OPTIONS = [
    { value: "今日", label: "今日" },
    { value: "昨日", label: "昨日" },
    { value: "今週", label: "今週" },
    { value: "過去7日間", label: "過去7日間" },
    { value: "過去30日間", label: "過去30日間" },
    { value: "過去90日間", label: "過去90日間" },
] as const;

export const SATISFACTION_FILTER_OPTIONS = [
    { value: "all", label: "すべて" },
    { value: "low", label: "低い (1-2)" },
    { value: "medium", label: "普通 (3)" },
    { value: "high", label: "高い (4-5)" },
] as const;

export const MODE_FILTER_OPTIONS = [
    { value: "all", label: "すべて" },
    { value: "PLATFORM", label: "プラットフォーム" },
    { value: "WIDGET", label: "ウィジェット" },
] as const;

export const DEFAULT_FILTERS = {
    dateFilter: "過去7日間" as const,
    domainFilter: "すべてのドメイン" as const,
    satisfactionFilter: "all" as const,
    modeFilter: "all" as const,
} as const;

