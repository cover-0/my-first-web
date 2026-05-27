import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 감각적인 404 타이포 및 아이콘 */}
        <div className="relative flex justify-center">
          <span className="text-[120px] font-extrabold tracking-tighter text-muted/30 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <line x1="9" y1="11" x2="15" y2="11" />
                <line x1="9" y1="18" x2="11" y2="18" />
              </svg>
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            요청하신 페이지가 삭제되었거나, 주소가 잘못되었을 수 있습니다.<br />
            아래 버튼을 눌러 블로그 메인으로 돌아가 보세요!
          </p>
        </div>

        {/* 복귀 액션 */}
        <div className="pt-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2">
            <Link href="/posts">블로그 메인으로 가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
