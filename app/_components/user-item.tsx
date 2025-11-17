import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface UserCardProps {
  avatarSrc: string;
  name: string;
  mail: string;
  onClick?: () => void;
}
export const UserItem = ({ avatarSrc, name, mail, onClick }: UserCardProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();
  return (
    <Link
      href="/profile"
      className="flex items-center justify-center space-x-3 p-2"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="w-12 h-12">
        <Avatar className="size-12 hover:opacity-75 transition">
          <AvatarImage src={avatarSrc ?? ""} alt={avatarFallback} />
          <AvatarFallback className="rounded-md bg-blue-400 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* User Info */}
      <div>
        <p className="text-black font-semibold dark:text-white">{name}</p>
        <p className="text-gray-500 text-sm dark:text-white">{mail}</p>
      </div>
    </Link>
  );
};
