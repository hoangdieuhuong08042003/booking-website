"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ColumnDef } from "@tanstack/react-table";

import { toast } from "sonner";

import { DataTable } from "./data-table";

import { Button } from "@/components/ui/button";
import { deleteListing, getListingByFilter } from "@/app/_actions/listing";
import { Amenity, Listing, RoomType } from "@prisma/client";
import { ActionButtons } from "../../_component/action-buttons";
import ConfirmDeleteDialog from "../../_component/confirm-delete-dialog";

// Query keys
const QUERY_KEYS = {
  listings: "listings",
  amenities: "amenities",
  roomTypes: "roomTypes",
} as const;

// Default column visibility state
const defaultColumnVisibility = {
  id: true,
  thumbnail: true,
  name: true,
  actions: true,
};

// Column names in Vietnamese
const ColumnNames: Record<string, string> = {
  id: "STT",
  thumbnail: "Ảnh đại diện",
  name: "Tên Listing",
  actions: "Thao tác",
};

export function ListingDataTable({ onAddClick }: { onAddClick: () => void }) {
  const queryClient = useQueryClient();
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch listings query
  const { data: listingsData } = useQuery({
    queryKey: [
      QUERY_KEYS.listings,
      pageIndex,
      pageSize,
      searchQuery,
      selectedAmenity,
      selectedRoomType,
    ],
    queryFn: () =>
      getListingByFilter({
        pageIndex,
        pageSize,
        title: searchQuery.trim(),
        selectedAmenities: selectedAmenity ? [selectedAmenity] : undefined,
        roomTypeId: selectedRoomType || undefined,
      }),
    refetchOnWindowFocus: false,
  });

  // Fetch amenities query
  const { data: amenities = [] } = useQuery({
    queryKey: [QUERY_KEYS.amenities],
    queryFn: async () => {
      // Implement getAmenity if not available
      const { getAmenity } = await import("@/app/_actions/listing");
      return getAmenity();
    },
    refetchOnWindowFocus: false,
  });

  // Fetch room types query
  const { data: roomTypes = [] } = useQuery({
    queryKey: [QUERY_KEYS.roomTypes],
    queryFn: async () => {
      // Implement getRoomTypes if not available
      return [];
    },
    refetchOnWindowFocus: false,
  });

  const onDelete = (id: string) => {
    setSelectedListingId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedListingId !== null) {
      try {
        // Find the listing to get thumbnail and images
        const listing = listingsData?.listings.find(
          (l) => l.id === selectedListingId
        );
        if (!listing) {
          throw new Error("Listing not found");
        }

        // Delete images from cloud if needed (implement if you want)
        // if (listing.thumbnail) await deleteImageFromCloudinary(listing.thumbnail);

        // Finally delete the listing itself
        await deleteListing(selectedListingId);

        const deletedListingName = listing.name;

        // Invalidate listings query to refetch data
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.listings] });

        toast.success(`Listing "${deletedListingName}" đã bị xóa.`);
      } catch (error) {
        console.error("Xóa listing lỗi:", error);
        toast.error("Có lỗi khi xóa listing.");
      } finally {
        setSelectedListingId(null);
        setIsDialogOpen(false);
      }
    }
  };

  const columns: ColumnDef<Listing>[] = [
    {
      accessorKey: "id",
      header: "STT",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "thumbnail",
      header: "Ảnh đại diện",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div className="h-12 w-12 overflow-hidden rounded-sm">
            <Image
              src={row.original.thumbnail || "/placeholder.png"}
              alt={row.original.name}
              width={50}
              height={50}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên Listing",
      cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <ActionButtons
          onEdit={() =>
            (window.location.href = `/admin/listing/edit/${row.original.id}`)
          }
          onDelete={() => onDelete(row.original.id)}
        />
      ),
    },
  ];

  const filterOptions = [
    {
      id: "amenity",
      label: "Tiện ích",
      options: amenities.map((amenity: Amenity) => ({
        label: amenity.name,
        value: amenity.id,
      })),
    },
    {
      id: "roomType",
      label: "Loại phòng",
      options: roomTypes.map((roomType: RoomType) => ({
        label: roomType.name,
        value: roomType.id,
      })),
    },
  ];

  const handleFilterChange = (columnId: string, value: string) => {
    if (columnId === "amenity") {
      setSelectedAmenity((prev) => (prev === value ? null : value));
      setPageIndex(0);
    }
    if (columnId === "roomType") {
      setSelectedRoomType((prev) => (prev === value ? null : value));
      setPageIndex(0);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={listingsData?.listings || []}
        filterOptions={filterOptions}
        totalPlans={listingsData?.total || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        filterState={{ selectedAmenity, selectedRoomType }}
        onFilterChange={handleFilterChange}
        defaultColumnVisibility={defaultColumnVisibility}
        columnNames={ColumnNames}
        addButtonText={
          <Button
            type="button"
            onClick={onAddClick}
            className="flex items-center cursor-pointer rounded"
          >
            <Plus className="size-4 text-inherit" />
            Thêm Listing
          </Button>
        }
      />

      <ConfirmDeleteDialog
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
