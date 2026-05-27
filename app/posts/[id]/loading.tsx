import { Button } from "@/components/ui/button";

export default function PostDetailLoading() {
  return (
    <article className="mx-auto w-full max-w-4xl space-y-6 animate-pulse">
      {/* 조회수 카운터 자리 스켈레톤 */}
      <div className="h-4 w-24 bg-muted rounded-md" />

      {/* 헤더 영역 스켈레톤 */}
      <header className="space-y-3">
        {/* 제목 */}
        <div className="h-9 bg-muted rounded-md w-3/4 md:w-2/3" />
        
        {/* 작성자, 작성일, 조회수 메타 정보 */}
        <div className="flex items-center gap-2">
          {/* 아바타와 텍스트를 모사하는 스켈레톤 */}
          <div className="h-4 bg-muted rounded-md w-16" />
          <span className="text-muted-foreground/30">•</span>
          <div className="h-4 bg-muted rounded-md w-24" />
          <span className="text-muted-foreground/30">•</span>
          <div className="h-4 bg-muted rounded-md w-12" />
        </div>
      </header>

      {/* 본문 스켈레톤 (문단 형태로 여러 줄 렌더링) */}
      <div className="space-y-3 py-4 border-y border-border/50">
        <div className="h-4 bg-muted rounded-md w-full" />
        <div className="h-4 bg-muted rounded-md w-full" />
        <div className="h-4 bg-muted rounded-md w-11/12" />
        <div className="h-4 bg-muted rounded-md w-5/6" />
        <div className="h-4 bg-muted rounded-md w-full" />
        <div className="h-4 bg-muted rounded-md w-4/5" />
      </div>

      {/* 하단 액션 버튼 스켈레톤 */}
      <div className="flex items-center gap-3">
        {/* 좋아요 버튼 자리 */}
        <div className="h-10 w-24 bg-muted rounded-md" />
        {/* 목록으로 버튼 자리 */}
        <div className="h-10 w-32 bg-muted rounded-md" />
        {/* 수정/삭제 버튼 자리 */}
        <div className="h-10 w-20 bg-muted rounded-md ml-auto" />
      </div>

      {/* 댓글 영역 스켈레톤 */}
      <div className="pt-6 space-y-4">
        <div className="h-6 bg-muted rounded-md w-24" />
        <div className="h-10 bg-muted rounded-md w-full" />
        
        <div className="space-y-4 pt-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded-md w-24" />
                <div className="h-3 bg-muted rounded-md w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
