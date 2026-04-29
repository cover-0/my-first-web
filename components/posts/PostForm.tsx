"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, type Post } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PostFormProps =
  | {
      mode: "create";
      heading: string;
      submitLabel: string;
      initialPost?: Pick<Post, "title" | "content">;
    }
  | {
      mode: "edit";
      heading: string;
      submitLabel: string;
      postId: number;
      initialPost: Pick<Post, "title" | "content">;
    };

export default function PostForm(props: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(props.initialPost?.title ?? "");
  const [content, setContent] = useState(props.initialPost?.content ?? "");
  const [titleError, setTitleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError("제목은 비어 있을 수 없습니다.");
      return;
    }

    setTitleError("");
    setIsSubmitting(true);

    try {
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (props.mode === "create") {
        await createPost({ title: trimmedTitle, content: trimmedContent });
        window.alert("저장되었습니다.");
        router.push("/posts");
      } else {
        await updatePost(props.postId, { title: trimmedTitle, content: trimmedContent });
        window.alert("수정되었습니다.");
        router.push(`/posts/${props.postId}`);
      }

      router.refresh();
    } catch {
      window.alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-semibold">{props.heading}</CardTitle>
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
              onChange={(event) => {
                setTitle(event.target.value);
                if (event.target.value.trim()) {
                  setTitleError("");
                }
              }}
              aria-invalid={titleError ? "true" : undefined}
              placeholder="제목을 입력하세요"
            />
            {titleError ? <p className="text-sm text-destructive">{titleError}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              내용
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={10}
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "저장 중..." : props.submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
