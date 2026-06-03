"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white dark:bg-background dark:text-foreground dark:border-b p-4 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-white">
          내 블로그
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
            홈
          </Link>
          <Link href="/posts" className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
            블로그
          </Link>

          {loading ? (
            <span className="text-gray-400 dark:text-muted-foreground">로딩 중...</span>
          ) : user ? (
            <>
              <Link href="/posts/new" className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
                새 글 쓰기
              </Link>
              <Link href={`/users/${user.id}`} className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
                내 프로필
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-200 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
                로그인
              </Link>
              <Link href="/signup" className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                회원가입
              </Link>
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
