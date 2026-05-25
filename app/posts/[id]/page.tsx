import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import PostActions from "./_components/PostActions";
import LikeButton from "./_components/LikeButton";
import CommentSection from "./_components/CommentSection";
import ViewCounter from "./_components/ViewCounter";

type PostDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { id } = await params;
	const supabase = createClient();

	const { data: post, error } = await supabase
		.from("posts")
		.select("id, title, content, created_at, user_id, view_count, profiles(username)")
		.eq("id", id)
		.single();

	if (error || !post) {
		notFound();
	}

	// 게시글의 총 좋아요 개수 가져오기
	const { count: likeCount } = await supabase
		.from("post_likes")
		.select("*", { count: "exact", head: true })
		.eq("post_id", post.id);

	// 댓글 목록 가져오기 (작성자 프로필 정보 포함)
	const { data: comments } = await supabase
		.from("comments")
		.select("*, profiles(username, avatar_url)")
		.eq("post_id", post.id)
		.order("created_at", { ascending: true });

	return (
		<article className="mx-auto w-full max-w-4xl space-y-6">
			<ViewCounter postId={post.id} />
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">{post.title}</h1>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="font-medium text-foreground">{(post.profiles as any)?.username || "익명"}</span>
					<span>•</span>
					<span>{new Date(post.created_at).toLocaleDateString()}</span>
					<span>•</span>
					<span className="flex items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
						{post.view_count || 0}
					</span>
				</div>
			</header>
			<p className="leading-7 whitespace-pre-wrap text-foreground">{post.content}</p>

			<div className="flex flex-wrap items-center gap-3">
				<LikeButton postId={post.id} initialLikeCount={likeCount || 0} />
				<Button asChild variant="link">
					<Link href="/posts">← 목록으로 돌아가기</Link>
				</Button>
				<PostActions postId={post.id} authorId={post.user_id} />
			</div>

			<CommentSection postId={post.id} initialComments={comments || []} />
		</article>
	);
}
