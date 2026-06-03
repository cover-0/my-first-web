"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 요구사항: 개발자용 상세 에러는 콘솔에 남김
    console.error("전역 에러 발생:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center border-border shadow-lg space-y-6">
        {/* 경고 아이콘 */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* 안내 문구 */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            문제가 발생했습니다
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            일시적인 오류가 발생했습니다.<br />
            서비스 이용에 불편을 드려 대단히 죄송합니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            다시 시도하기
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>

        {/* 개발용 간략 정보 */}
        {error.digest && (
          <p className="text-[10px] text-muted-foreground/40 font-mono select-none">
            Error ID: {error.digest}
          </p>
        )}
      </Card>
    </div>
  );
}
