"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeletePostButton from "./DeletePostButton";
import { useAuth } from "@/contexts/AuthContext";

type PostActionsProps = {
  postId: string;
  authorId: string;
};

export default function PostActions({ postId, authorId }: PostActionsProps) {
  const { user, loading } = useAuth();

  // UX를 위한 클라이언트 측 UI 표시/숨김 분기입니다.
  // 실제 데이터 수정 및 삭제 방어(보안)는 Ch11의 데이터베이스 RLS 설정에서 처리합니다.
  if (loading || !user || user.id !== authorId) {
    return null;
  }

  return (
    <>
      <Button asChild variant="outline">
        <Link href={`/posts/${postId}/edit`}>수정</Link>
      </Button>
      <DeletePostButton postId={postId} />
    </>
  );
}