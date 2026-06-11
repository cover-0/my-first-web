import { UserCircle } from "lucide-react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  className?: string;
}

export function UserAvatar({ avatarUrl, username, className = "h-8 w-8" }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${username || "User"} avatar`}
        className={`rounded-full object-cover border ${className}`}
      />
    );
  }

  return (
    <UserCircle className={`text-muted-foreground ${className}`} strokeWidth={1.5} />
  );
}
