"use client";

import Image from "next/image";
import { UserButton } from "@/app/_components/user-button";

const HeaderAdmin = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-mode border-b top-0 left-0 fixed z-10">
      <div className="flex items-center">
        <Image
          src="/logo.jpg"
          alt="EXVIZ Gallery Logo"
          width={140}
          height={32}
          className="cursor-pointer"
          priority
        />
      </div>
      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default HeaderAdmin;
