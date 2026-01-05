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
      header: () => <div className="text-center">STT</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">{row.index + 1}</p>
      ),
    },
    {
      accessorKey: "listing.name",
      header: () => <div className="text-center">Listing</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">{row.original.listing?.name || "-"}</p>
      ),
    },
    {
      accessorKey: "user.name",
      header: () => <div className="text-center">Khách</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">{row.original.user?.name || "-"}</p>
      ),
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-center">Bắt đầu</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const value = row.original.startDate;
        return (
          <p className="text-center">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </p>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-center">Kết thúc</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const value = row.original.endDate;
        return (
          <p className="text-center">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng thái</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => {
        const status = row.original.status;
        let color = "gray";
        if (status === "ACTIVE") color = "green";
        else if (status === "CANCELLED") color = "red";
        else if (status === "BLOCKED") color = "orange";
        else if (status === "COMPLETED") color = "blue";
        return (
          <span className="block text-center" style={{ color }}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: () => <div className="text-center">Tổng tiền</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">
          {row.original.totalPrice?.toLocaleString("vi-VN") || "-"}
        </p>
      ),
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center">SĐT</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <p className="text-center">{row.original.phone}</p>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Thao tác</div>,
      cell: ({ row }: CellContext<ReservationWithRelations, unknown>) => (
        <div className="flex justify-center">
          <ActionButtons
            onEdit={() => handleEdit(row.original.id)}
            onDelete={() => handleDelete(row.original.id)}
          />
        </div>
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
