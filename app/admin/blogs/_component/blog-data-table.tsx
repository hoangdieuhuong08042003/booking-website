"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmDeleteDialog from "../../_component/confirm-delete-dialog";
import { DataTable } from "../../_component/data-table";
import { ActionButtons } from "../../_component/action-buttons";
import BlogCreateDialog from "./blog-create-dialog";

// Đúng kiểu Blog như Prisma
export interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string | null;
  publishedAt: Date; // Changed from string to Date
  updatedAt: Date; // Changed from string to Date
}

interface BlogDataTableProps {
  blogs: Blog[];
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export default function BlogDataTable({
  blogs,
  onCreate,
  onDelete,
}: BlogDataTableProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "stt",
      header: "STT",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "imageUrl",
      header: "Ảnh",
      cell: ({ row }) =>
        row.original.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.original.imageUrl}
            alt="blog"
            className="w-16 h-10 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">Không có</span>
        ),
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => <p>{row.original.title}</p>,
    },
    {
      accessorKey: "author",
      header: "Tác giả",
      cell: ({ row }) => <p>{row.original.author ?? ""}</p>,
    },
    {
      accessorKey: "publishedAt",
      header: "Ngày đăng",
      cell: ({ row }) =>
        row.original.publishedAt
          ? row.original.publishedAt instanceof Date
            ? row.original.publishedAt.toLocaleDateString()
            : new Date(row.original.publishedAt).toLocaleDateString()
          : "",
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <ActionButtons
          onEdit={() => router.push(`/admin/blogs/edit/${row.original.id}`)}
          onDelete={() => setDeleteId(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>
      <BlogCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async () => {
          setIsCreateDialogOpen(false);
          onCreate();
        }}
      />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
      />
      <DataTable
        columns={columns}
        data={blogs}
        filterPlaceholder="Tìm kiếm blog..."
        addButtonText={
          <>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm blog</span>
            <span className="sm:hidden ">Thêm</span>
          </>
        }
        onAddClick={() => setIsCreateDialogOpen(true)}
        pageSize={10}
      />
    </>
  );
}
