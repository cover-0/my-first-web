"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/posts";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      await createPost({
        title: title.trim(),
        content: content.trim(),
      });
      alert("저장되었습니다.");
      router.push("/posts");
      router.refresh();
    } catch {
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl">
      <h1 className="text-2xl font-bold">새 게시글 작성</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (event.target.value.trim()) {
                setTitleError("");
              }
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 focus:border-gray-500"
            placeholder="제목을 입력하세요"
          />
          {titleError ? <p className="mt-2 text-sm text-red-600">{titleError}</p> : null}
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 focus:border-gray-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </form>
    </section>
  );
}
