"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, BadgeJapaneseYen, Sun, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserItem } from "@/app/_components/user-item";

const HeaderAdmin = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const name = session?.user?.name || "";
  const avatar = session?.user?.image || "";
  const email = session?.user?.email || "";
  const avatarFallback = name?.charAt(0).toUpperCase();

  const handleLogOut = () => {
    import("next-auth/react").then(({ signOut }) => signOut());
  };

  const handleProfileClick = () => {
    router.push(`/user/${session?.user?.id}`);
  };

  const handleSubscriptionClick = () => {
    router.push("/subscription");
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Avatar
                className="cursor-pointer hover:border-2 hover:border-gray-500"
                onClick={handleProfileClick}
              >
                <AvatarImage src={avatar ?? ""} alt={avatarFallback} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel>
              <p>アカウント</p>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <UserItem
                avatarSrc={avatar}
                name={name}
                mail={email}
                onClick={handleProfileClick}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
            >
              {document.documentElement.classList.contains("dark") ? (
                <>
                  <Sun />
                  明るい
                </>
              ) : (
                <>
                  <SunMoon />
                  暗い
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSubscriptionClick}>
              <BadgeJapaneseYen />
              アカウントのアップグレード
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut />
              サインアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
