import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">내 블로그</h1>
      <p className="mt-3 text-gray-600">웹 개발을 배우며 기록하는 공간</p>
      <div className="mt-6">
        <Link
          href="/posts"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          게시글 목록 보기
        </Link>
      </div>
    </section>
  );
}
