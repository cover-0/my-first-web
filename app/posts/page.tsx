import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default async function PostsPage() {
  const supabase = createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-center text-red-500">게시글을 불러오는데 실패했습니다.</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="p-6 text-center text-gray-500">작성된 게시글이 없습니다.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">블로그</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          글쓰기
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md bg-card text-card-foreground"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
            <p className="mt-3 text-xs text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
