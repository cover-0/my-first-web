import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 6; // 한 페이지당 보여줄 게시글 수 (2열 그리드에 맞춰 6개로 설정)

type PostsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const supabase = createClient();
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  // Supabase의 range() 함수를 위한 시작점과 끝점 계산
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 전체 데이터 개수(count: "exact")와 현재 페이지의 데이터(range)를 함께 가져옵니다.
  const { data: posts, count, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at, user_id, post_likes(count), comments(count), profiles(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return <div className="p-6 text-center text-red-500">게시글을 불러오는데 실패했습니다.</div>;
  }

  // 총 페이지 수 계산
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

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

      {!posts || posts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">작성된 게시글이 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md bg-card text-card-foreground"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{(post.profiles as any)?.username || "익명"}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 text-red-500"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{post.post_likes?.[0]?.count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 text-blue-500"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  <span>{post.comments?.[0]?.count || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 버튼 영역 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`/posts?page=${currentPage - 1}`}>이전</Link>
            ) : (
              <span>이전</span>
            )}
          </Button>
          
          <span className="text-sm font-medium text-gray-600">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/posts?page=${currentPage + 1}`}>다음</Link>
            ) : (
              <span>다음</span>
            )}
          </Button>
        </div>
      )}
      </>
      )}
    </section>
  );
}
