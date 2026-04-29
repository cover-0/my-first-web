import Link from "next/link";
import PostForm from "@/components/posts/PostForm";
import { Button } from "@/components/ui/button";
import { fetchPostById } from "@/lib/posts";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-destructive">잘못된 게시글 주소입니다</h1>
        <Button asChild variant="link">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
      </section>
    );
  }

  const post = await fetchPostById(numericId);

  if (!post) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-destructive">게시글을 찾을 수 없습니다</h1>
        <Button asChild variant="link">
          <Link href="/posts">← 목록으로 돌아가기</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <PostForm
        mode="edit"
        heading="게시글 수정"
        submitLabel="수정 저장"
        postId={post.id}
        initialPost={{ title: post.title, content: post.content }}
      />
    </section>
  );
}
