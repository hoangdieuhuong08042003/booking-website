"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "@/app/_actions/user/user-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ActionButtons } from "../_component/action-buttons";
import ConfirmDeleteDialog from "../_component/confirm-delete-dialog";
import { Plus } from "lucide-react";
import { DataTable } from "../listing/_components/data-table"; // dùng lại DataTable của listing
import UserCreateDialog, { UserCreateFormValues } from "./UserCreateDialog";
import UserEditDialog, { UserEditFormValues } from "./UserEditDialog";
import { User } from "@prisma/client";
import type { CellContext } from "@tanstack/react-table";

// Add this type for table rows (no password)
type UserTableRow = Omit<User, "password">;

const QUERY_KEYS = {
  users: "users",
} as const;

const defaultColumnVisibility = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  actions: true,
};

const ColumnNames: Record<string, string> = {
  id: "ID",
  name: "Tên",
  email: "Email",
  role: "Quyền",
  createdAt: "Ngày tạo",
  actions: "Thao tác",
};

export function UserDataTable() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserTableRow | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: [QUERY_KEYS.users, pageIndex, pageSize, search],
    queryFn: async () => {
      // Gọi đúng hàm lấy user từ actions
      return await adminListUsers({
        pageIndex,
        pageSize,
        search,
      });
    },
    refetchOnWindowFocus: false,
  });

  // columns cho DataTable
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <p className="text-center">{cell.row.original.id}</p>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <p className="text-center">{cell.row.original.name}</p>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <p className="text-center">{cell.row.original.email}</p>
      ),
    },
    {
      accessorKey: "role",
      header: "Quyền",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <p className="text-center">{cell.row.original.role}</p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <p className="text-center">
          {new Date(cell.row.original.createdAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (cell: CellContext<UserTableRow, unknown>) => (
        <ActionButtons
          onEdit={() => openEditForm(cell.row.original)}
          onDelete={() => handleDelete(cell.row.original.id)}
        />
      ),
    },
  ];

  const openAddForm = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditForm = (user: UserTableRow) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      await adminDeleteUser(selectedUserId);
      toast.success("Đã xóa user");
      refetch();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setSelectedUserId(null);
      setIsDialogOpen(false);
    }
  };

  const handleCreateUser = async (values: UserCreateFormValues) => {
    await adminCreateUser(values);
    refetch();
  };

  const handleEditUser = async (values: UserEditFormValues) => {
    if (!editUser) return;
    await adminUpdateUser(editUser.id, values);
    setEditUser(null);
    refetch();
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.users ?? []}
        totalPlans={data?.total ?? 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        searchTerm={search}
        onSearchChange={setSearch}
        defaultColumnVisibility={defaultColumnVisibility}
        columnNames={ColumnNames}
        addButtonText={
          <Button
            type="button"
            onClick={openAddForm}
            className="flex items-center cursor-pointer rounded"
          >
            <Plus className="size-4 text-inherit" />
            Thêm User
          </Button>
        }
      />

      <UserCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateUser}
      />

      <UserEditDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditUser(null);
        }}
        user={editUser as User | null} // Use explicit type cast instead of 'any'
        onEdit={handleEditUser}
      />

      <ConfirmDeleteDialog
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
