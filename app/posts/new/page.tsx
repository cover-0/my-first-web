import PostForm from "@/components/posts/PostForm";

export default function NewPostPage() {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <PostForm mode="create" heading="새 게시글 작성" submitLabel="저장" />
    </section>
  );
}
