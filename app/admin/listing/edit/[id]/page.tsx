"use client";
import { useParams } from "next/navigation";
import EditListingForm from "../../_components/edit-plan-form";

export default function EditPlanPage() {
  const { id } = useParams();
  const listingId = Array.isArray(id) ? id[0] : id;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white rounded-xl mt-24 p-4 shadow dark:bg-[#3A3A3A]">
      <EditListingForm listingId={listingId || ""} />
    </div>
  );
}
