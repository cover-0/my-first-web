"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-white">
          내 블로그
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-gray-200 hover:text-white">
            홈
          </Link>
          <Link href="/posts" className="text-gray-200 hover:text-white">
            블로그
          </Link>

          {loading ? (
            <span className="text-gray-400">로딩 중...</span>
          ) : user ? (
            <>
              <Link href="/posts/new" className="text-gray-200 hover:text-white">
                새 글 쓰기
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-200 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-200 hover:text-white">
                로그인
              </Link>
              <Link href="/signup" className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
