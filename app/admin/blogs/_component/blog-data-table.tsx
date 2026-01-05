"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import ConfirmDeleteDialog from "../../_component/confirm-delete-dialog";
import { DataTable } from "../../_component/data-table";
import { ActionButtons } from "../../_component/action-buttons";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "stt",
      header: () => <div className="text-center">STT</div>,
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-center">Ảnh</div>,
      cell: ({ row }) =>
        row.original.imageUrl ? (
          <div className="flex justify-center">
            <Image
              src={row.original.imageUrl}
              alt="blog"
              width={64}
              height={40}
              className="w-16 h-10 object-cover rounded"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <span className="text-gray-400 italic flex justify-center">
            Không có
          </span>
        ),
    },
    {
      accessorKey: "title",
      header: () => <div className="text-center">Tiêu đề</div>,
      cell: ({ row }) => <p className="text-center">{row.original.title}</p>,
    },
    {
      accessorKey: "author",
      header: () => <div className="text-center">Tác giả</div>,
      cell: ({ row }) => (
        <p className="text-center">{row.original.author ?? ""}</p>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: () => <div className="text-center">Ngày đăng</div>,
      cell: ({ row }) =>
        row.original.publishedAt ? (
          <div className="text-center">
            {row.original.publishedAt instanceof Date
              ? row.original.publishedAt.toLocaleDateString()
              : new Date(row.original.publishedAt).toLocaleDateString()}
          </div>
        ) : (
          <div className="text-center"></div>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Hành động</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ActionButtons
            onEdit={() => router.push(`/admin/blogs/edit/${row.original.id}`)}
            onDelete={() => setDeleteId(row.original.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
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
        onAddClick={onCreate}
        pageSize={10}
      />
    </>
  );
}
