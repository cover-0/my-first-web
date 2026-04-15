"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
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
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
    >
      {isDeleting ? "삭제 중..." : "삭제"}
    </button>
  );
}