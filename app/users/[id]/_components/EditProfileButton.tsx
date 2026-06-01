"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProfileButton({ profileId }: { profileId: string }) {
  const { user } = useAuth();
  
  if (user?.id !== profileId) return null;
  
  return (
    <Button variant="outline" size="sm" asChild className="mt-4">
      <Link href="/profile">내 정보 수정</Link>
    </Button>
  );
}
