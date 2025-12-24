"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAmenity,
  removeAmenity,
  updateAmenity,
  listAmenities,
} from "@/app/_actions/listing/listing-amenity-actions";
import AmenityDataTable from "./_component/amenities-data-table";
import { toast } from "sonner";

export default function AmenityManagementPage() {
  const queryClient = useQueryClient();

  const { data: amenities = [] } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const fetchedAmenities = await listAmenities();
      return fetchedAmenities;
    },
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: createAmenity,
    onSuccess: (newAmenity) => {
      queryClient.setQueryData(
        ["amenities"],
        (old: { id: string; name: string }[] = []) => [
          ...old,
          { id: newAmenity.id, name: newAmenity.name },
        ]
      );
      // Hiển thị toast sau khi cập nhật cache
      setTimeout(() => {
        toast.success(`Đã thêm tiện nghi "${newAmenity.name}" thành công.`);
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Thêm tiện nghi thất bại.");
      }, 0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateAmenity(id, { name }),
    onSuccess: (updatedAmenity) => {
      queryClient.setQueryData(
        ["amenities"],
        (old: { id: string; name: string }[] = []) =>
          old.map((a) =>
            a.id === updatedAmenity.id ? { ...a, name: updatedAmenity.name } : a
          )
      );
      setTimeout(() => {
        toast.success(
          `Đã cập nhật tiện nghi "${updatedAmenity.name}" thành công.`
        );
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Cập nhật tiện nghi thất bại.");
      }, 0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeAmenity(id),
    onSuccess: (deleted) => {
      queryClient.setQueryData(
        ["amenities"],
        (old: { id: string; name: string }[] = []) =>
          old.filter((a) => a.id !== deleted.id)
      );
      setTimeout(() => {
        toast.success("Đã xóa tiện nghi thành công.");
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Xóa tiện nghi thất bại.");
      }, 0);
    },
  });

  const handleCreate = async (data: { name: string }) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (id: string, name: string) => {
    updateMutation.mutate({ id, name });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <AmenityDataTable
      amenities={amenities}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
