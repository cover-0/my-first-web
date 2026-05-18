import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import PostActions from "./_components/PostActions";

type PostDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { id } = await params;
	const supabase = createClient();

	const { data: post, error } = await supabase
		.from("posts")
		.select("id, title, content, created_at, user_id")
		.eq("id", id)
		.single();

	if (error || !post) {
		notFound();
	}

	return (
		<article className="mx-auto w-full max-w-4xl space-y-6">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">{post.title}</h1>
				<p className="text-sm text-muted-foreground">
					{new Date(post.created_at).toLocaleDateString()}
				</p>
			</header>
			<p className="leading-7 whitespace-pre-wrap text-foreground">{post.content}</p>

			<div className="flex flex-wrap items-center gap-3">
				<Button asChild variant="link">
					<Link href="/posts">← 목록으로 돌아가기</Link>
				</Button>
				<PostActions postId={post.id} authorId={post.user_id} />
			</div>
		</article>
	);
}
