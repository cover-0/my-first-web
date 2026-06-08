"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ease-in-out border-b border-primary/20 bg-gradient-to-r from-primary/[0.18] via-background/90 to-purple-500/[0.18] shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:border-primary/30 dark:from-primary/[0.25] dark:via-background/85 dark:to-purple-500/[0.25] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-extrabold text-xl tracking-tight transition-transform hover:scale-[1.02]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            내 블로그
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="relative text-muted-foreground hover:text-foreground transition-colors py-1 group">
            홈
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left rounded-full" />
          </Link>
          <Link href="/posts" className="relative text-muted-foreground hover:text-foreground transition-colors py-1 group">
            블로그
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left rounded-full" />
          </Link>

          {loading ? (
            <span className="text-muted-foreground animate-pulse">로딩 중...</span>
          ) : user ? (
            <>
              <Link href="/posts/new" className="relative text-muted-foreground hover:text-foreground transition-colors py-1 group">
                새 글 쓰기
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left rounded-full" />
              </Link>
              <Link href={`/users/${user.id}`} className="relative text-muted-foreground hover:text-foreground transition-colors py-1 group">
                내 프로필
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left rounded-full" />
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-muted-foreground hover:text-destructive transition-colors py-1">
                    로그아웃
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
                    <DialogDescription>
                      로그아웃 시 서비스 이용을 위해 다시 로그인해야 합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive" onClick={handleSignOut}>
                        로그아웃
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors py-1">
                로그인
              </Link>
              <Button asChild size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0 hover:-translate-y-0.5">
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          )}
          
          <div className="pl-2 border-l border-border/50">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
