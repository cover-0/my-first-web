export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <header>
        <h1>내 블로그</h1>
        <nav className="flex justify-between items-center" aria-label="주요 메뉴">
          <ul className="flex items-center gap-4">
            <li>
              <a href="/">홈</a>
            </li>
            <li>
              <a href="/posts">게시글</a>
            </li>
            <li>
              <a href="/about">소개</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-bold">첫 번째 게시글 제목</h2>
            <p className="text-gray-600">첫 번째 게시글의 내용 미리보기입니다.</p>
            <p>작성자: 홍길동</p>
            <time className="text-sm text-gray-400" dateTime="2026-03-30">2026-03-30</time>
          </article>

          <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-bold">두 번째 게시글 제목</h2>
            <p className="text-gray-600">두 번째 게시글의 내용 미리보기입니다.</p>
            <p>작성자: 김개발</p>
            <time className="text-sm text-gray-400" dateTime="2026-03-29">2026-03-29</time>
          </article>

          <article className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-bold">세 번째 게시글 제목</h2>
            <p className="text-gray-600">세 번째 게시글의 내용 미리보기입니다.</p>
            <p>작성자: 이프론트</p>
            <time className="text-sm text-gray-400" dateTime="2026-03-28">2026-03-28</time>
          </article>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-400">
        <p>© 2026 내 블로그</p>
      </footer>
    </div>
  );
}
