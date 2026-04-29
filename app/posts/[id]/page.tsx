import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchPostById } from "@/lib/posts";
import DeletePostButton from "./_components/DeletePostButton";

type PostDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { id } = await params;
	const numericId = Number(id);

	if (!Number.isFinite(numericId)) {
		return (
			<section className="mx-auto w-full max-w-4xl space-y-4 text-center">
				<h1 className="text-2xl font-semibold text-destructive">
					잘못된 게시글 주소입니다
				</h1>
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
				<h1 className="text-2xl font-semibold text-destructive">
					게시글을 찾을 수 없습니다
				</h1>
				<Button asChild variant="link">
					<Link href="/posts">← 목록으로 돌아가기</Link>
				</Button>
			</section>
		);
	}

	return (
		<article className="mx-auto w-full max-w-4xl space-y-6">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">{post.title}</h1>
				<p className="text-sm text-muted-foreground">
					{post.author} · {post.date}
				</p>
			</header>
			<p className="leading-7 text-foreground">{post.content}</p>

			<div className="flex flex-wrap items-center gap-3">
				<Button asChild variant="link">
					<Link href="/posts">← 목록으로 돌아가기</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href={`/posts/${post.id}/edit`}>수정</Link>
				</Button>
				<DeletePostButton postId={post.id} />
			</div>
		</article>
	);
}
