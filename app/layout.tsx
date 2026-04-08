import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "웹 개발을 배우며 기록하는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="font-semibold text-white">
              내 블로그
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-200 hover:text-white">
                홈
              </Link>
              <Link href="/posts" className="text-gray-200 hover:text-white">
                블로그
              </Link>
              <Link href="/posts/new" className="text-gray-200 hover:text-white">
                새 글 쓰기
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6 flex-1 w-full">{children}</main>
        <footer className="text-center text-gray-500 py-4">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
