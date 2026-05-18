"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // 파라미터 언랩
  useEffect(() => {
    params.then((unwrapped) => setPostId(unwrapped.id));
  }, [params]);

  useEffect(() => {
    if (!postId || authLoading || !user) return;

    const fetchPost = async () => {
      setIsFetching(true);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("title, content, user_id")
        .eq("id", postId)
        .single();

      if (fetchError || !data) {
        alert("게시글을 불러올 수 없습니다.");
        router.push("/posts");
        return;
      }

      // UX를 위한 클라이언트 측 UI 표시/숨김 분기입니다.
      // 실제 데이터 수정 및 삭제 방어(보안)는 Ch11의 데이터베이스 RLS 설정에서 처리합니다.
      if (data.user_id !== user.id) {
        alert("수정 권한이 없습니다.");
        router.push(`/posts/${postId}`);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setIsFetching(false);
    };

    fetchPost();
  }, [postId, authLoading, user, router]);

  // 로딩 상태 처리 등
  if (authLoading || isFetching) return null;

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title: trimmedTitle,
        content: trimmedContent,
      })
      .eq("id", postId);

    setIsSubmitting(false);

    if (updateError) {
      setError("게시글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    alert("수정되었습니다.");
    router.push(`/posts/${postId}`);
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <Card className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-semibold">게시글 수정</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                제목
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-foreground">
                내용
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-[300px]"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push(`/posts/${postId}`)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "수정 중..." : "수정 완료"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
