"use client";

import { UserButton } from "@/app/_components/user-button";
import Link from "next/link";

const HeaderAdmin = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-mode border-b top-0 left-0 fixed z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow">
            T
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            TravelHub
          </span>
        </div>
        <Link
          href="/"
          className="text-base font-semibold text-primary hover:underline transition-colors"
          style={{ letterSpacing: 0.2 }}
        >
          Trang chủ
        </Link>
      </div>
      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default HeaderAdmin;
