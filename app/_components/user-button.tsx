"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserItem } from "./user-item";

export const UserButton = () => {
  const { data: sessionData, status } = useSession();
  const isLoading = status === "loading";
  const data = sessionData?.user;
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!data) {
    return null;
  }

  const { image, name, email } = data;
  const avatarFallback = name?.charAt(0).toUpperCase() || "?";

  async function logOut() {
    await signOut();
    router.push("/");
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar
          className="size-10 cursor-pointer hover:border-2 hover:border-gray-500"
          onClick={() => {}}
        >
          <AvatarImage src={image ?? ""} alt={avatarFallback} />
          <AvatarFallback className=" bg-blue-400 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6">
        <DropdownMenuLabel>
          <p>アカウント</p>
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserItem
            avatarSrc={image ?? ""}
            name={name ?? ""}
            mail={email ?? ""}
            onClick={() => setOpen(false)}
          />
        </DropdownMenuItem>

        <Link href="/setting">
          <DropdownMenuItem>
            <Settings />
            設定
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={logOut}>
          <LogOut />
          サインアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
