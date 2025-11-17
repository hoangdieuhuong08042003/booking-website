import { DashboardHeader } from "../_components/dashboard-header";
import { getNewestListings } from "../_actions/listing/listing-actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // fetch initial listings on the server using the action
  const newestListings = await getNewestListings();

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      {/* client-side interactive component receives server-fetched data */}
      <DashboardClient initialListings={newestListings} />
    </main>
  );
}
