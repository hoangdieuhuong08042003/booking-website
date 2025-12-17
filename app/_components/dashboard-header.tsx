"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "./user-button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`border-b border-border sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            T
          </div>
          <span className="text-xl font-bold text-foreground">TravelHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"}>
              Tìm kiếm
            </Button>
          </Link>
          <Link href="/dashboard/itinerary">
            <Button
              variant={
                pathname === "/dashboard/itinerary" ? "secondary" : "ghost"
              }
            >
              Gợi ý du lịch
            </Button>
          </Link>
          <Link href="/dashboard/mybookings">
            <Button
              variant={
                pathname === "/dashboard/mybookings" ? "secondary" : "ghost"
              }
            >
              Booking của tôi
            </Button>
          </Link>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
