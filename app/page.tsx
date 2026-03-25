export default function Home() {
  const posts = [
    {
      id: 1,
      title: "Next.js App Router로 첫 블로그 만들기",
      excerpt:
        "App Router 구조를 기준으로 페이지를 나누고, 홈 화면을 블로그 스타일로 구성한 과정을 정리합니다.",
      category: "Next.js",
      date: "2026-03-25",
      readTime: "5분",
    },
    {
      id: 2,
      title: "Tailwind CSS로 읽기 좋은 카드 UI 만들기",
      excerpt:
        "타이포그래피와 여백, 그림자 조합만으로 콘텐츠 중심의 카드 레이아웃을 구현하는 방법을 소개합니다.",
      category: "CSS",
      date: "2026-03-22",
      readTime: "4분",
    },
    {
      id: 3,
      title: "Server Component 기본 패턴 정리",
      excerpt:
        "데이터 표시 중심의 페이지를 Server Component로 구성할 때 알아두면 좋은 실전 패턴을 정리했습니다.",
      category: "React",
      date: "2026-03-20",
      readTime: "6분",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-12 text-zinc-900">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Personal Blog
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">김태휘의 개발 기록</h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            프론트엔드와 웹 개발을 공부하며 배운 내용을 정리하는 공간입니다. 구현 과정에서
            마주친 문제와 해결 방법을 중심으로 기록합니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-zinc-200">
              <p className="text-sm font-medium text-zinc-500">대표 글</p>
              <h2 className="mt-2 text-2xl font-bold">{posts[0].title}</h2>
              <p className="mt-3 leading-7 text-zinc-700">{posts[0].excerpt}</p>
              <p className="mt-4 text-sm text-zinc-500">
                {posts[0].date} · {posts[0].readTime} 읽기
              </p>
            </article>

            <section className="space-y-4">
              <h3 className="text-xl font-bold">최신 글</h3>
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <h4 className="mt-2 text-xl font-bold">{post.title}</h4>
                  <p className="mt-2 text-zinc-700">{post.excerpt}</p>
                </article>
              ))}
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <h3 className="text-lg font-bold">카테고리</h3>
              <ul className="mt-3 space-y-2 text-zinc-700">
                <li>Next.js</li>
                <li>React</li>
                <li>CSS</li>
                <li>회고</li>
              </ul>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <h3 className="text-lg font-bold">소개</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                사용자 경험을 고민하는 프론트엔드 개발자를 목표로 학습 중입니다.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
