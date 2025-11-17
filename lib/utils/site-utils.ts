import { PageData } from "@/types";
import { SiteRole } from "@prisma/client";

/**
 * Transform site data to PageData format
 */
export function transformSiteToPageData(site: {
  id: string;
  name: string;
  domain: string;
  role: SiteRole;
  priority: number;
}): PageData {
  return {
    id: site.id,
    name: site.name,
    pageName: site.name,
    domain: site.domain,
    role: site.role,
    priority: site.priority,
    status: "アクティブ",
    allowCrawl: true,
    respectRobots: true,
    crawl: "有効",
    autoGenerateQA: true,
    crawlExclusion: "",
    qaTemplate: "",
  };
}

/**
 * Calculate crawl status based on allowCrawl and respectRobots
 */
export function calculateCrawlStatus(
  allowCrawl: boolean,
  respectRobots: boolean
): string {
  return allowCrawl && respectRobots ? "有効" : "無効";
}

/**
 * Get next priority for new site
 */
export function getNextPriority(pages: PageData[]): number {
  return pages.length > 0
    ? Math.max(...pages.map((p) => p.priority ?? 0)) + 1
    : 1;
}

/**
 * Reindex priorities to be continuous (1, 2, 3, ...)
 */
export function reindexPriorities(pages: PageData[]): PageData[] {
  return pages
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .map((page, idx) => ({ ...page, priority: idx + 1 }));
}

/**
 * Filter pages by search value
 */
export function filterPagesBySearch(
  pages: PageData[],
  searchValue: string
): PageData[] {
  if (!searchValue.trim()) return pages;

  const search = searchValue.toLowerCase();
  return pages.filter(
    (page) =>
      page.pageName.toLowerCase().includes(search) ||
      page.domain.toLowerCase().includes(search)
  );
}

/**
 * Filter pages by multiple criteria
 */
export function filterPages(
  pages: PageData[],
  filters: {
    role?: string;
    status?: string;
    crawl?: string;
  }
): PageData[] {
  return pages.filter((page) => {
    const matchRole = !filters.role || String(page.role) === filters.role;
    const matchStatus = !filters.status || page.status === filters.status;
    const matchCrawl = !filters.crawl || page.crawl === filters.crawl;

    return matchRole && matchStatus && matchCrawl;
  });
}

/**
 * Clean domain URL by removing http/https/www prefixes
 */
export function cleanDomainUrl(url: string): string {
  if (!url) return url;

  // Remove whitespace
  let cleaned = url.trim();

  // Remove http:// or https://
  cleaned = cleaned.replace(/^https?:\/\//, '');

  // Remove www. prefix
  cleaned = cleaned.replace(/^www\./, '');

  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '');

  return cleaned;
}

/**
 * Calculate site statistics
 */
export function calculateSiteStats(pages: PageData[]) {
  return {
    total: pages.length,
    active: pages.filter((p) => p.status === "アクティブ").length,
    inactive: pages.filter((p) => p.status === "無効").length,
    crawlEnabled: pages.filter((p) => p.allowCrawl && p.respectRobots).length,
  };
}
