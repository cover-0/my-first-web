
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로딩 중일 때는 아무것도 표시하지 않음
  if (loading) return null;

  // 비로그인 상태면 로그인 페이지로 리다이렉트
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

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        title: trimmedTitle,
        content: trimmedContent,
        user_id: user.id, // 작성자 ID 설정
      })
      .select("id")
      .single();

    setIsSubmitting(false);

    if (insertError) {
      console.error("게시글 저장 에러:", insertError);
      setError(`게시글 저장에 실패했습니다. (${insertError.message})`);
      return;
    }

    if (data) {
      alert("작성되었습니다.");
      // 새 작성된 글 상세 페이지로 이동
      router.push(`/posts/${data.id}`);
      router.refresh();
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <Card className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-semibold">새 게시글 작성</CardTitle>
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
              <Button type="button" variant="outline" onClick={() => router.push("/posts")}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
