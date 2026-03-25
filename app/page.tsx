export default function Home() {
  const posts = [
    {
      title: "Next.js App Router로 블로그 시작하기",
      summary:
        "App Router 기반으로 폴더 구조를 정리하고, 페이지를 Server Component 중심으로 구성하는 방법을 정리합니다.",
      date: "2026.03.25",
      category: "Next.js",
    },
    {
      title: "Tailwind CSS로 빠르게 글 목록 레이아웃 만들기",
      summary:
        "카드형 포스트 리스트, 반응형 그리드, 타이포그래피 유틸리티를 활용해 읽기 좋은 블로그 UI를 구현합니다.",
      date: "2026.03.21",
      category: "CSS",
    },
    {
      title: "개발 기록을 오래 남기는 글쓰기 루틴",
      summary:
        "학습 내용을 짧은 단위로 기록하고 주간 단위로 회고해 지식을 축적하는 개인 블로그 운영 루틴을 소개합니다.",
      date: "2026.03.18",
      category: "Writing",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
          <h1 className="text-2xl font-bold">My Dev Blog</h1>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#" className="transition-colors hover:text-slate-900">
              홈
            </a>
            <a href="#" className="transition-colors hover:text-slate-900">
              카테고리
            </a>
            <a href="#" className="transition-colors hover:text-slate-900">
              소개
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <article className="rounded-lg bg-white p-7 shadow">
            <p className="text-sm text-slate-500">오늘의 글</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              개발과 기록이 만나는 공간
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              프론트엔드 학습 과정에서 얻은 인사이트와 시행착오를 정리하는 개인
              블로그입니다. 실전에서 바로 활용할 수 있는 예제와 함께 꾸준히
              업데이트합니다.
            </p>
          </article>

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                  <span>{post.date}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{post.summary}</p>
                <a
                  href="#"
                  className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  더 읽기 →
                </a>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-bold">블로그 소개</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              웹 개발을 공부하며 배운 내용을 정리합니다. Next.js, Tailwind CSS,
              타입스크립트 관련 글을 주로 다룹니다.
            </p>
          </section>

          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-bold">카테고리</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Next.js</li>
              <li>TypeScript</li>
              <li>CSS</li>
              <li>회고</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
