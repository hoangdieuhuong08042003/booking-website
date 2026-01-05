"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  createBlog,
  deleteBlog,
} from "@/app/_actions/blog/blog-actions";
import BlogDataTable from "./_component/blog-data-table";
import { toast } from "sonner";
import type { Blog } from "@prisma/client";
import CreateDialog from "../_component/create-dialog"; // import dialog

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
      // Prepend new blog to the top of the list so it appears immediately
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
  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateBlog = async (data: { name: string }) => {
    // Map dialog data to blog fields
    await createMutation.mutateAsync({
      title: data.name,
      content: "", // You may want to extend the dialog to accept content
    });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <CreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateBlog}
        title="Tạo mới blog"
        label="Tiêu đề blog"
        errorMessage="Tạo blog thất bại."
      />
      <BlogDataTable
        blogs={tableBlogs}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    </>
  );
}
