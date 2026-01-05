"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  createBlog,
  deleteBlog,
} from "@/app/_actions/blog/blog-actions";
import BlogDataTable from "./_component/blog-data-table";
import BlogCreateDialog from "./_component/blog-create-dialog";
import { toast } from "sonner";
import type { Blog } from "@prisma/client";

export default function BlogManagementPage() {
  const queryClient = useQueryClient();

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: rawBlogs = [] } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  });

  // Đảm bảo các trường nullable là string | null, và ngày là Date
  const tableBlogs = (rawBlogs ?? []).map((b) => ({
    ...b,
    excerpt: b.excerpt ?? "",
    imageUrl: b.imageUrl ?? "",
    author: b.author ?? "",
    publishedAt:
      typeof b.publishedAt === "string"
        ? new Date(b.publishedAt)
        : b.publishedAt,
    updatedAt:
      typeof b.updatedAt === "string" ? new Date(b.updatedAt) : b.updatedAt,
  }));

  const createMutation = useMutation({
    mutationFn: (data: Partial<Blog>) =>
      createBlog({
        title: data.title ?? "",
        content: data.content ?? "",
        excerpt: data.excerpt ?? "",
        imageUrl: data.imageUrl ?? "",
        author: data.author ?? "",
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt as string | Date).toISOString()
          : undefined,
      }),
    onSuccess: (newBlog: Blog) => {
      queryClient.setQueryData<Blog[]>(["blogs"], (old: Blog[] = []) => [
        newBlog,
        ...old,
      ]);
      setTimeout(() => {
        toast.success(`Đã thêm blog "${newBlog.title}" thành công.`);
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Thêm blog thất bại.");
      }, 0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: (deleted: Blog) => {
      queryClient.setQueryData<Blog[]>(["blogs"], (old: Blog[] = []) =>
        old.filter((b) => b.id !== deleted.id)
      );
      setTimeout(() => {
        toast.success("Đã xóa blog thành công.");
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Xóa blog thất bại.");
      }, 0);
    },
  });

  // Handler cho BlogCreateDialog
  // Sử dụng Partial<Blog> cho data
  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <BlogDataTable
        blogs={tableBlogs}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
      <BlogCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={async (data) => {
          createMutation.mutate({
            title: data.title,
            content: "",
            excerpt: "",
            imageUrl: "",
            author: "",
            publishedAt: undefined,
          });
        }}
      />
    </>
  );
}
