"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    const recordView = async () => {
      // 로컬 스토리지에서 이미 본 글의 목록을 가져옵니다
      const viewedPosts = JSON.parse(localStorage.getItem("viewed_posts") || "[]");

      // 만약 이 글을 아직 본 적이 없다면?
      if (!viewedPosts.includes(postId)) {
        // 🔥 React Strict Mode(개발 환경)로 인한 중복 실행을 막기 위해 
        // 데이터베이스에 요청하기 '전'에 곧바로 로컬 스토리지에 기록합니다.
        viewedPosts.push(postId);
        localStorage.setItem("viewed_posts", JSON.stringify(viewedPosts));

        const supabase = createClient();
        
        // 데이터베이스의 조회수를 1 증가시킵니다.
        const { error } = await supabase.rpc("increment_view_count", { p_post_id: postId });
        
        if (error) {
          // 만약 에러가 났다면 기록을 취소(롤백)합니다.
          const rollbackPosts = viewedPosts.filter((id: string) => id !== postId);
          localStorage.setItem("viewed_posts", JSON.stringify(rollbackPosts));
        }
      }
    };

    recordView();
  }, [postId]);

  return null; // 화면에 그릴 것은 없습니다!
}