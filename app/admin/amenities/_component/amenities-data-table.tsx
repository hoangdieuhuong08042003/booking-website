"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateDialog from "../../_component/create-dialog";
import AmenityEditDialog from "./amenities-edit-dialog";
import ConfirmDeleteDialog from "../../_component/confirm-delete-dialog";
import { DataTable } from "../../_component/data-table";
import { ActionButtons } from "../../_component/action-buttons";
import { Amenity } from "@prisma/client";

interface AmenityDataTableProps {
  amenities: Amenity[];
  onCreate: (data: { name: string }) => Promise<void>;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function AmenityDataTable({
  amenities,
  onCreate,
  onUpdate,
  onDelete,
}: AmenityDataTableProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);

  const columns: ColumnDef<Amenity>[] = [
    {
      accessorKey: "stt",
      header: "番号",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "アメニティ名",
      cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
    },
    {
      id: "actions",
      header: "アクション",
      cell: ({ row }) => (
        <ActionButtons
          onEdit={() => setEditingAmenity(row.original)}
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
        title="アメニティを作成"
        label="名前"
        errorMessage="アメニティの作成に失敗しました。"
      />
      <AmenityEditDialog
        open={!!editingAmenity}
        onOpenChange={(open) => !open && setEditingAmenity(null)}
        amenity={editingAmenity}
        onUpdate={async (id, name) => {
          await onUpdate(id, name);
          setEditingAmenity(null);
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
        data={amenities}
        filterPlaceholder="アメニティを検索..."
        addButtonText={
          <>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">アメニティを追加</span>
            <span className="sm:hidden ">追加</span>
          </>
        }
        onAddClick={() => setIsCreateDialogOpen(true)}
        pageSize={10}
      />
    </>
  );
}
