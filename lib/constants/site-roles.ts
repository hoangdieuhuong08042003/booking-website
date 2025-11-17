import { SiteRole } from "@prisma/client";

export const SITE_ROLE_LABELS: Record<SiteRole, string> = {
    official: "公式",
    product: "商品",
    case_study: "事例",
    support: "サポート",
    corporate: "企業",
    news: "ニュース",
};

export const SITE_ROLE_COLORS: Record<SiteRole, string> = {
    official: "bg-gray-100 text-gray-800",
    product: "bg-blue-100 text-blue-800",
    case_study: "bg-purple-100 text-purple-800",
    support: "bg-pink-100 text-pink-800",
    corporate: "bg-green-100 text-green-800",
    news: "bg-yellow-100 text-yellow-800",
};

export function getSiteRoleLabel(role: SiteRole): string {
    return SITE_ROLE_LABELS[role] || role;
}

export function getSiteRoleColor(role: SiteRole): string {
    return SITE_ROLE_COLORS[role] || "bg-gray-100 text-gray-800";
}
