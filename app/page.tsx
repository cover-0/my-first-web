import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            내 블로그
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
          웹 개발을 배우며 기록하는 공간입니다. 새로운 기술을 탐구하고 인사이트를 공유합니다.
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <Link href="/posts">
            게시글 목록 보기
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full hover:bg-muted transition-colors duration-300">
          <Link href="/posts/new">
            첫 글 쓰기
          </Link>
        </Button>
      </div>
    </section>
  );
}
