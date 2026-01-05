"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAmenity,
  removeAmenity,
  updateAmenity,
  listAmenities,
  createRoomType,
  listRoomTypes,
  updateRoomType,
  removeRoomType,
} from "@/app/_actions/listing/listing-amenity-actions";
import AmenityDataTable from "./_component/amenities-data-table";
import RoomTypeDataTable from "./_component/roomtype-data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

export default function AmenityManagementPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("amenities");

  // Amenity logic
  const { data: amenities = [] } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => await listAmenities(),
    refetchOnWindowFocus: false,
  });
  const createAmenityMutation = useMutation({
    mutationFn: createAmenity,
    onSuccess: (newAmenity) => {
      queryClient.setQueryData(
        ["amenities"],
        (old: { id: string; name: string }[] = []) => [
          { id: newAmenity.id, name: newAmenity.name },
          ...old,
        ]
      );
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
  const updateAmenityMutation = useMutation({
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
  const deleteAmenityMutation = useMutation({
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
  const handleCreateAmenity = async (data: { name: string }) => {
    createAmenityMutation.mutate(data);
  };
  const handleUpdateAmenity = async (id: string, name: string) => {
    updateAmenityMutation.mutate({ id, name });
  };
  const handleDeleteAmenity = async (id: string) => {
    deleteAmenityMutation.mutate(id);
  };

  // RoomType logic
  const { data: roomTypes = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: async () => await listRoomTypes(),
    refetchOnWindowFocus: false,
  });
  const createRoomTypeMutation = useMutation({
    mutationFn: createRoomType,
    onSuccess: (newRoomType) => {
      queryClient.setQueryData(
        ["roomTypes"],
        (old: { id: string; name: string; desc?: string }[] = []) => [
          {
            id: newRoomType.id,
            name: newRoomType.name,
            desc: newRoomType.desc,
          },
          ...old,
        ]
      );
      setTimeout(() => {
        toast.success(`Đã thêm kiểu phòng "${newRoomType.name}" thành công.`);
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Thêm kiểu phòng thất bại.");
      }, 0);
    },
  });
  const updateRoomTypeMutation = useMutation({
    mutationFn: ({
      id,
      name,
      desc,
    }: {
      id: string;
      name: string;
      desc?: string;
    }) => updateRoomType(id, { name, desc }),
    onSuccess: (updatedRoomType) => {
      queryClient.setQueryData(
        ["roomTypes"],
        (old: { id: string; name: string; desc?: string }[] = []) =>
          old.map((a) =>
            a.id === updatedRoomType.id
              ? { ...a, name: updatedRoomType.name, desc: updatedRoomType.desc }
              : a
          )
      );
      setTimeout(() => {
        toast.success(
          `Đã cập nhật kiểu phòng "${updatedRoomType.name}" thành công.`
        );
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Cập nhật kiểu phòng thất bại.");
      }, 0);
    },
  });
  const deleteRoomTypeMutation = useMutation({
    mutationFn: (id: string) => removeRoomType(id),
    onSuccess: (deleted) => {
      queryClient.setQueryData(
        ["roomTypes"],
        (old: { id: string; name: string; desc?: string }[] = []) =>
          old.filter((a) => a.id !== deleted.id)
      );
      setTimeout(() => {
        toast.success("Đã xóa kiểu phòng thành công.");
      }, 0);
    },
    onError: () => {
      setTimeout(() => {
        toast.error("Xóa kiểu phòng thất bại.");
      }, 0);
    },
  });
  const handleCreateRoomType = async (data: {
    name: string;
    desc?: string;
  }) => {
    createRoomTypeMutation.mutate(data);
  };
  const handleUpdateRoomType = async (
    id: string,
    data: { name: string; desc?: string }
  ) => {
    updateRoomTypeMutation.mutate({ id, ...data });
  };
  const handleDeleteRoomType = async (id: string) => {
    deleteRoomTypeMutation.mutate(id);
  };

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
        <TabsTrigger value="roomTypes">Kiểu phòng</TabsTrigger>
      </TabsList>
      <TabsContent value="amenities">
        <AmenityDataTable
          amenities={amenities}
          onCreate={handleCreateAmenity}
          onUpdate={handleUpdateAmenity}
          onDelete={handleDeleteAmenity}
        />
      </TabsContent>
      <TabsContent value="roomTypes">
        <RoomTypeDataTable
          roomTypes={roomTypes}
          onCreate={handleCreateRoomType}
          onUpdate={handleUpdateRoomType}
          onDelete={handleDeleteRoomType}
        />
      </TabsContent>
    </Tabs>
  );
}
