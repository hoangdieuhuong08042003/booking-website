"use client";

import { UserButton } from "@/app/_components/user-button";

const HeaderAdmin = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-mode border-b top-0 left-0 fixed z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
          T
        </div>
        <span className="text-xl font-bold text-foreground">TravelHub</span>
      </div>
      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default HeaderAdmin;
