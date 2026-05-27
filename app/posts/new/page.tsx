
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
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
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
    setValidationErrors({});
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    const errors: { title?: string; content?: string } = {};

    if (!trimmedTitle) {
      errors.title = "제목을 입력해주세요.";
    } else if (trimmedTitle.length < 2) {
      errors.title = "제목은 최소 2자 이상 입력해야 합니다.";
    }

    if (!trimmedContent) {
      errors.content = "내용을 입력해주세요.";
    } else if (trimmedContent.length < 10) {
      errors.content = "내용은 최소 10자 이상 입력해야 합니다.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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
      // 요구사항: 서버/Supabase 에러 원문은 console.error로 기록
      console.error("게시글 저장 에러 상세:", insertError);
      // 화면에는 친절한 비기술적 메시지만 표시
      setFormError("네트워크 연결 또는 서버 오류가 발생하여 게시글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
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
                placeholder="제목을 입력하세요 (최소 2자)"
                disabled={isSubmitting}
                className={validationErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {validationErrors.title && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-foreground">
                내용
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요 (최소 10자)"
                className={`min-h-[300px] ${
                  validationErrors.content ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.content && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {validationErrors.content}
                </p>
              )}
            </div>

            {formError && (
              <p className="text-sm font-medium text-destructive p-3 rounded-md bg-destructive/10">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/posts")}
                disabled={isSubmitting}
              >
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
