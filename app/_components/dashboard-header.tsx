"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "./user-button";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            T
          </div>
          <span className="text-xl font-bold text-foreground">TravelHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Tìm kiếm</Button>
          </Link>
          <Link href="/dashboard/mybookings">
            <Button variant="ghost">Booking của tôi</Button>
          </Link>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
