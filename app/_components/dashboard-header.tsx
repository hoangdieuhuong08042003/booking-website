"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    await signOut();
    router.push("/");
    setLoading(false);
  };

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
          <Link href="/dashboard/bookings">
            <Button variant="ghost">Booking của tôi</Button>
          </Link>
          <Button variant="ghost">Hồ sơ</Button>
          <Button
            variant="ghost"
            className="text-destructive"
            onClick={handleLogout}
            disabled={loading}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
