"use client";
import React, { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createListing } from "@/app/_actions/listing";
import CreateDialog from "../_component/create-dialog";
import { ListingDataTable } from "./_components/plans-data-table";

const ListingPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async (data: { name: string }) => {
    try {
      await createListing({
        name: data.name,
        type: "",
        desc: "",
        pricePerNight: 0,
        beds: 1,
        thumbnail: "",
      });
      toast.success("Listing đã được tạo thành công!");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
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
