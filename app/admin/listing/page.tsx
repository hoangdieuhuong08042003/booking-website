"use client";
import React, { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createListing } from "@/app/_actions/listing";
import CreateDialog from "../_component/create-dialog";
import { ListingDataTable } from "./_components/listing-data-table";
import { Listing } from "@prisma/client";

const ListingPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async (data: { name: string }) => {
    try {
      const newListing = await createListing({
        name: data.name,
        type: "",
        desc: "",
        pricePerNight: 0,
        beds: 1,
        thumbnail: "",
      });
      toast.success("Listing đã được tạo thành công!");
      // Prepend new listing to the first page cache if exists
      queryClient.setQueryData(
        ["listings", 0, 10, "", null, null],
        (old: { listings: Listing[]; total: number } | undefined) =>
          old
            ? {
                ...old,
                listings: [newListing, ...(old.listings || [])],
                total: (old.total || 0) + 1,
              }
            : undefined
      );
      // Optionally, you can also invalidate for other queries if needed
    } catch {
      toast.error("Tạo listing thất bại.");
    }
  };

  return (
    <>
      <CreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreate}
        title="Tạo Listing"
        label="Tên Listing"
        errorMessage="Tạo listing thất bại."
      />
      <ListingDataTable onAddClick={() => setIsCreateDialogOpen(true)} />
    </>
  );
};

export default ListingPage;
