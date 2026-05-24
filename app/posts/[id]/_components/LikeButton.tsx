"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type LikeButtonProps = {
  postId: string;
  initialLikeCount: number;
};

export default function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // 클라이언트에서 현재 사용자의 좋아요 여부 확인
  useEffect(() => {
    async function checkUserLike() {
      if (!user) {
        setIsLiked(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
      setIsLoading(false);
    }

    checkUserLike();
  }, [postId, user, supabase]);

  const handleToggleLike = async () => {
    // 1. 비회원 클릭 제어 (로그인 창으로 이동)
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (isLoading) return;

    // 2. Optimistic UI
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!previousIsLiked);
    setLikeCount((prev) => (previousIsLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      if (previousIsLiked) {
        // 좋아요 취소 (삭제)
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // 좋아요 (추가)
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      // 복원
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading && !user}
      className={`flex items-center gap-2 transition-colors ${
        isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-gray-500"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>{likeCount}</span>
    </Button>
  );
}