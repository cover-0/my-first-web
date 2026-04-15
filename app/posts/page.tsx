import SearchablePostList from "./_components/SearchablePostList";
import { fetchPosts } from "@/lib/posts";

export default async function PostsPage() {
  const postList = await fetchPosts();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">블로그</h1>
      <SearchablePostList initialPosts={postList} />
    </section>
  );
}
