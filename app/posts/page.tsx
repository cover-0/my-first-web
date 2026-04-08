import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">블로그</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>
            <p className="mt-3 text-sm text-gray-500">
              {post.author} · {post.date}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
