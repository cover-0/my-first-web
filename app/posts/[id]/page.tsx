import Link from "next/link";
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
			<section className="max-w-2xl mx-auto text-center">
				<h1 className="text-2xl font-bold text-red-600">잘못된 게시글 주소입니다</h1>
				<Link href="/posts" className="mt-4 inline-block text-blue-600 hover:underline">
					← 목록으로 돌아가기
				</Link>
			</section>
		);
	}

	const post = await fetchPostById(numericId);

	if (!post) {
		return (
			<section className="max-w-2xl mx-auto text-center">
				<h1 className="text-2xl font-bold text-red-600">게시글을 찾을 수 없습니다</h1>
				<Link href="/posts" className="mt-4 inline-block text-blue-600 hover:underline">
					← 목록으로 돌아가기
				</Link>
			</section>
		);
	}

	return (
		<article className="max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold">{post.title}</h1>
			<p className="mt-2 text-sm text-gray-500">
				{post.author} · {post.date}
			</p>
			<p className="mt-6 leading-7 text-gray-800">{post.content}</p>

			<div className="mt-8 flex items-center gap-3">
				<Link href="/posts" className="inline-block text-blue-600 hover:underline">
					← 목록으로 돌아가기
				</Link>
				<DeletePostButton postId={post.id} />
			</div>
		</article>
	);
}
