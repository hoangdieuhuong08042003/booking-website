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
      header: "STT",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "Tên tiện nghi",
      cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
    },
    {
      id: "actions",
      header: "Hành động",
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
        title="Tạo tiện nghi"
        label="Tên"
        errorMessage="Tạo tiện nghi thất bại."
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
        filterPlaceholder="Tìm kiếm tiện nghi..."
        addButtonText={
          <>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm tiện nghi</span>
            <span className="sm:hidden ">Thêm</span>
          </>
        }
        onAddClick={() => setIsCreateDialogOpen(true)}
        pageSize={10}
      />
    </>
  );
}
