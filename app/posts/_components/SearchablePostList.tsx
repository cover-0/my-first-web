  "use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";
import SearchBar from "./SearchBar";

type SearchablePostListProps = {
  initialPosts: Post[];
};

export default function SearchablePostList({ initialPosts }: SearchablePostListProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return initialPosts;
    }

    return initialPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalized) ||
        post.author.toLowerCase().includes(normalized)
      );
    });
  }, [initialPosts, query]);

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} />

      {filteredPosts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
              <p className="mt-3 text-sm text-gray-500">
                {post.author} · {post.date}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}