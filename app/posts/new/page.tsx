"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert("저장되었습니다");
    router.push("/posts");
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
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 focus:border-gray-500"
            placeholder="제목을 입력하세요"
          />
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
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          저장
        </button>
      </form>
    </section>
  );
}
