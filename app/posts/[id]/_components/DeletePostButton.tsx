"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/posts";

type DeletePostButtonProps = {
  postId: number;
};

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setDeletedPosts] = useState<Post[]>([]);

  const handleDelete = async () => {
    const shouldDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const ok = await deletePost(postId);
      if (!ok) {
        window.alert("삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setDeletedPosts((previous) => previous.filter((post) => post.id !== postId));
      window.alert("삭제되었습니다.");
      router.push("/posts");
      router.refresh();
    } catch {
      window.alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "삭제 중..." : "삭제"}
    </Button>
  );
}