import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  avatarSrc: string;
  name: string;
  mail: string;
  onClick?: () => void;
}
export const UserItem = ({ avatarSrc, name, mail }: UserCardProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();
  return (
    <>
      {/* Ảnh đại diện */}
      <div className="w-12 h-12">
        <Avatar className="size-12 hover:opacity-75 transition">
          <AvatarImage src={avatarSrc ?? ""} alt={avatarFallback} />
          <AvatarFallback className="rounded-md bg-blue-400 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Thông tin người dùng */}
      <div>
        <p className="text-black font-semibold dark:text-white">{name}</p>
        <p className="text-gray-500 text-sm dark:text-white">{mail}</p>
      </div>
    </>
  );
};
