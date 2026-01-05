"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  BedDouble,
  Settings,
  CalendarCheck2,
  Users2,
  BookOpen, // thêm icon cho blog
} from "lucide-react";
import Link from "next/link";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="h-full bg-white " collapsible="icon">
      <SidebarHeader className="w-full items-center py-4 mt-20">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg group-data-[state=collapsed]:hidden">
              Quản trị hệ thống
            </span>
            <SidebarTrigger className="hidden md:inline-flex" />
          </div>
        </div>
        <Separator className="mt-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <Link href="/admin" className="w-full">
                <SidebarMenuButton
                  tooltip="Bảng điều khiển"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <LayoutDashboard
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Bảng điều khiển
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Quản lý phòng */}
            <SidebarMenuItem>
              <Link href="/admin/listing" className="w-full">
                <SidebarMenuButton
                  tooltip="Quản lý phòng"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin/listing"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <BedDouble
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin/listings"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Quản lý phòng
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Quản lý tiện ích */}
            <SidebarMenuItem>
              <Link href="/admin/amenities" className="w-full">
                <SidebarMenuButton
                  tooltip="Quản lý tiện ích"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin/amenities"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <Settings
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin/amenities"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Quản lý tiện ích
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Quản lý blog */}
            <SidebarMenuItem>
              <Link href="/admin/blogs" className="w-full">
                <SidebarMenuButton
                  tooltip="Quản lý blog"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin/blogs"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <BookOpen
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin/blogs"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Quản lý blog
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Quản lý đặt phòng */}
            <SidebarMenuItem>
              <Link href="/admin/reservations" className="w-full">
                <SidebarMenuButton
                  tooltip="Quản lý đặt phòng"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin/reservations"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <CalendarCheck2
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin/reservations"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Quản lý đặt phòng
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Quản lý người dùng */}
            <SidebarMenuItem>
              <Link href="/admin/users" className="w-full">
                <SidebarMenuButton
                  tooltip="Quản lý người dùng"
                  size="lg"
                  className={`
                    p-3 h-fit flex items-center
                    ${
                      pathname === "/admin/users"
                        ? "bg-gray-100 font-semibold rounded-md dark:bg-[#AAAAAA]/20"
                        : ""
                    }
                    group-data-[state=collapsed]:justify-center cursor-pointer
                  `}
                >
                  <Users2
                    className={`size-6 dark:text-gray-300 ${
                      pathname === "/admin/users"
                        ? "text-black dark:text-gray-200"
                        : ""
                    }`}
                  />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">
                    Quản lý người dùng
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
