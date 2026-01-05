"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateDialog from "../../_component/create-dialog";
import ConfirmDeleteDialog from "../../_component/confirm-delete-dialog";
import { DataTable } from "../../_component/data-table";
import { ActionButtons } from "../../_component/action-buttons";
import RoomTypeEditDialog from "./roomtype-edit-dialog";

interface RoomType {
  id: string;
  name: string;
  desc?: string | null;
}

interface RoomTypeDataTableProps {
  roomTypes: RoomType[];
  onCreate: (data: { name: string; desc?: string }) => Promise<void>;
  onUpdate: (
    id: string,
    data: { name: string; desc?: string }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RoomTypeDataTable({
  roomTypes,
  onCreate,
  onUpdate,
  onDelete,
}: RoomTypeDataTableProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  const columns: ColumnDef<RoomType>[] = [
    {
      accessorKey: "stt",
      header: "STT",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "Tên kiểu phòng",
      cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
    },
    {
      accessorKey: "desc",
      header: "Mô tả",
      cell: ({ row }) => (
        <p className="text-center">{row.original.desc || ""}</p>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <ActionButtons
          onEdit={() => setEditingRoomType(row.original)}
          onDelete={() => setDeleteId(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>
      <CreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={onCreate}
        title="Tạo kiểu phòng"
        label="Tên kiểu phòng"
        errorMessage="Tạo kiểu phòng thất bại."
      />
      <RoomTypeEditDialog
        open={!!editingRoomType}
        onOpenChange={(open) => !open && setEditingRoomType(null)}
        roomType={editingRoomType}
        onUpdate={async (id, data) => {
          await onUpdate(id, data);
          setEditingRoomType(null);
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
        data={roomTypes}
        filterPlaceholder="Tìm kiếm kiểu phòng..."
        addButtonText={
          <>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm kiểu phòng</span>
            <span className="sm:hidden ">Thêm</span>
          </>
        }
        onAddClick={() => setIsCreateDialogOpen(true)}
        pageSize={10}
      />
    </>
  );
}
