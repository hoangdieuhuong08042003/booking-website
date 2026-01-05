"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListReservations,
  adminDeleteReservation,
} from "@/app/_actions/reservation/reservation-actions";
import { DataTable } from "../listing/_components/data-table";
import { toast } from "sonner";
import { ActionButtons } from "../_component/action-buttons";
import { Reservation } from "@prisma/client";
import { CellContext } from "@tanstack/react-table";
import ConfirmDeleteDialog from "../_component/confirm-delete-dialog";

// Sử dụng type Reservation từ Prisma và bổ sung các quan hệ cần thiết
type ReservationWithRelations = Reservation & {
  user?: { name?: string | null };
  listing?: { name?: string | null };
};

const ColumnNames: Record<string, string> = {
  id: "STT",
  "listing.name": "Listing",
  "user.name": "Khách",
  startDate: "Bắt đầu",
  endDate: "Kết thúc",
  status: "Trạng thái",
  totalPrice: "Tổng tiền",
  phone: "SĐT",
  actions: "Thao tác",
};

export function ReservationDataTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [, setLoading] = useState(false);

  // Dialog state for delete confirmation
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  // Fetch reservations query
  const { data: reservationsData, refetch } = useQuery({
    queryKey: ["reservations", pageIndex, pageSize, search],
    queryFn: () =>
      adminListReservations({
        pageIndex,
        pageSize,
        search, // search sẽ được backend xử lý cho các trường: tên khách, SĐT, tên listing
      }),
    refetchOnWindowFocus: false,
  });

  const handleEdit = (id: string) => {
    router.push(`/admin/reservations/edit/${id}`);
  };

  // Open confirm dialog
  const handleDelete = (id: string) => {
    setSelectedReservationId(id);
    setIsDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!selectedReservationId) return;
    setLoading(true);
    try {
      await adminDeleteReservation(selectedReservationId);
      toast.success("Đã xoá reservation");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      toast.error("Xoá thất bại");
    } finally {
      setLoading(false);
      setSelectedReservationId(null);
      setIsDialogOpen(false);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "STT",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">{row.index + 1}</p>
      ),
    },
    {
      accessorKey: "listing.name",
      header: "Listing",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) =>
        row.original.listing?.name || "-",
    },
    {
      accessorKey: "user.name",
      header: "Khách",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) =>
        row.original.user?.name || "-",
    },
    {
      accessorKey: "startDate",
      header: "Bắt đầu",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const value = row.original.startDate;
        return value ? new Date(value).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "endDate",
      header: "Kết thúc",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const value = row.original.endDate;
        return value ? new Date(value).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const status = row.original.status;
        let color = "gray";
        if (status === "ACTIVE") color = "green";
        else if (status === "CANCELLED") color = "red";
        else if (status === "BLOCKED") color = "orange";
        else if (status === "COMPLETED") color = "blue";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Tổng tiền",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) =>
        row.original.totalPrice?.toLocaleString("vi-VN") || "-",
    },
    {
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) =>
        row.original.phone,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <ActionButtons
          onEdit={() => handleEdit(row.original.id)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={reservationsData?.reservations || []}
        filterPlaceholder="Tìm kiếm theo tên khách, SĐT, hoặc tên khách sạn..."
        totalPlans={reservationsData?.total || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        searchTerm={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPageIndex(0);
        }}
        columnNames={ColumnNames}
      />
      <ConfirmDeleteDialog
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
