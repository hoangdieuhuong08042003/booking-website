"use client";

import { useState, useCallback, useMemo } from "react";
import { PageData } from "@/types";
import { createSite, updateSite, deleteSiteById } from "@/app/_actions/site";
import { SiteRole } from "@prisma/client";
import { ToastService } from "@/lib/toast-service";

interface UseSitesProps {
  initialPages: PageData[];
}

interface UseSitesReturn {
  // Data
  pages: PageData[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    crawlEnabled: number;
  };

  // UI State
  searchValue: string;
  setSearchValue: (value: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingPage: PageData | null;
  setEditingPage: (page: PageData | null) => void;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Actions
  handleCreate: (data: CreateSiteData) => Promise<void>;
  handleUpdate: (id: string, data: UpdateSiteData) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleReorder: (reorderedPages: PageData[]) => Promise<void>;
  handleEdit: (page: PageData) => void;
  handleCloseDialog: () => void;
}

type CreateSiteData = Omit<PageData, "id" | "priority">;
type UpdateSiteData = Partial<CreateSiteData> & { priority?: number };

export function useSites({ initialPages }: UseSitesProps): UseSitesReturn {
  // Core state
  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);

  // Computed stats
  const stats = useMemo(
    () => ({
      total: pages.length,
      active: pages.filter((p) => p.status === "アクティブ").length,
      inactive: pages.filter((p) => p.status === "無効").length,
      crawlEnabled: pages.filter((p) => p.allowCrawl && p.respectRobots).length,
    }),
    [pages]
  );

  // Helper functions
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) setError(null);
  }, []);

  const handleError = useCallback((message: string, error?: unknown) => {
    console.error(message, error);
    setError(message);
    setIsLoading(false);
  }, []);

  const getNextPriority = useCallback(() => {
    return pages.length > 0
      ? Math.max(...pages.map((p) => p.priority ?? 0)) + 1
      : 1;
  }, [pages]);

  // CRUD Actions
  const handleCreate = useCallback(
    async (data: CreateSiteData) => {
      try {
        setLoading(true);

        const created = await createSite({
          name: data.pageName,
          domain: data.domain,
          role: data.role as SiteRole,
          priority: getNextPriority(),
        });

        const newPage: PageData = {
          id: created.id,
          name: created.name,
          pageName: created.name,
          domain: created.domain,
          role: created.role,
          priority: created.priority,
          status: data.status ?? "アクティブ",
          allowCrawl: Boolean(data.allowCrawl),
          respectRobots: Boolean(data.respectRobots),
          crawl: data.allowCrawl && data.respectRobots ? "有効" : "無効",
          autoGenerateQA: Boolean(data.autoGenerateQA),
          crawlExclusion: data.crawlExclusion ?? "",
          qaTemplate: data.qaTemplate ?? "",
        };

        setPages((prev) =>
          [...prev, newPage].sort(
            (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
          )
        );
        ToastService.siteCreated(created.name);
      } catch (err) {
        handleError("Failed to create site", err);
        ToastService.createFailed();
      }
    },
    [getNextPriority, setLoading, handleError]
  );

  const handleUpdate = useCallback(
    async (id: string, data: UpdateSiteData) => {
      try {
        setLoading(true);

        const updatePayload = {
          name: data.pageName,
          domain: data.domain,
          role: data.role,
          ...(data.priority && { priority: data.priority }),
        };

        const updated = await updateSite({ id, data: updatePayload });

        setPages((prev) =>
          prev.map((page) =>
            page.id === id
              ? {
                  ...page,
                  ...updated,
                  pageName: updated.name,
                  status: data.status ?? page.status,
                  allowCrawl: data.allowCrawl ?? page.allowCrawl,
                  respectRobots: data.respectRobots ?? page.respectRobots,
                  crawl:
                    (data.allowCrawl ?? page.allowCrawl) &&
                    (data.respectRobots ?? page.respectRobots)
                      ? "有効"
                      : "無効",
                }
              : page
          )
        );

        ToastService.siteUpdated(updated.name);
      } catch (err) {
        handleError("Failed to update site", err);
        ToastService.updateFailed();
      }
    },
    [setLoading, handleError]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        const pageToDelete = pages.find((p) => p.id === id);
        if (!pageToDelete) {
          throw new Error("Site not found");
        }

        await deleteSiteById(id);

        // Reindex priorities
        const remaining = pages
          .filter((p) => p.id !== id)
          .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
          .map((page, idx) => ({ ...page, priority: idx + 1 }));

        setPages(remaining);

        // Update server priorities
        await Promise.allSettled(
          remaining.map((page) =>
            updateSite({ id: page.id, data: { priority: page.priority } })
          )
        );

        ToastService.siteDeleted(pageToDelete.pageName);
      } catch (err) {
        handleError("Failed to delete site", err);
        ToastService.deleteFailed();
      }
    },
    [pages, setLoading, handleError]
  );

  const handleReorder = useCallback(
    async (reorderedPages: PageData[]) => {
      try {
        setLoading(true);

        const updatedPages = reorderedPages.map((page, idx) => ({
          ...page,
          priority: idx + 1,
        }));

        setPages(updatedPages);

        // Update server priorities
        for (const page of updatedPages) {
          try {
            await updateSite({
              id: page.id,
              data: { priority: page.priority },
            });
          } catch {
            // Continue on individual failures
          }
        }

        ToastService.siteReorderSuccess();
      } catch (err) {
        handleError("Failed to reorder sites", err);
        ToastService.operationFailed("サイトの順序更新");
      }
    },
    [setLoading, handleError]
  );

  // UI Actions
  const handleEdit = useCallback((page: PageData) => {
    setEditingPage(page);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingPage(null);
  }, []);

  return {
    // Data
    pages,
    stats,

    // UI State
    searchValue,
    setSearchValue,
    isDialogOpen,
    setIsDialogOpen,
    editingPage,
    setEditingPage,

    // Loading & Error
    isLoading,
    error,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleReorder,
    handleEdit,
    handleCloseDialog,
  };
}
