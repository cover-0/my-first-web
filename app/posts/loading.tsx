import { Card } from "@/components/ui/card";

export default function PostsLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      {/* 타이틀 및 버튼 영역 스켈레톤 */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-muted rounded-md" />
        <div className="h-10 w-20 bg-muted rounded-md" />
      </div>

      {/* 2열 스켈레톤 카드 그리드 (6개 아이템) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-6 border border-border bg-card space-y-4">
            {/* 제목 스켈레톤 */}
            <div className="h-6 bg-muted rounded-md w-3/4" />
            
            {/* 본문 스켈레톤 (2줄) */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-full" />
              <div className="h-4 bg-muted rounded-md w-5/6" />
            </div>

            {/* 하단 메타 정보 스켈레톤 */}
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/50">
              {/* 작성자 & 작성일 */}
              <div className="flex items-center gap-2">
                <div className="h-3 bg-muted rounded-md w-16" />
                <span className="text-muted-foreground/30">•</span>
                <div className="h-3 bg-muted rounded-md w-20" />
              </div>
              
              {/* 조회수 & 좋아요 & 댓글 아이콘 프레임 */}
              <div className="flex items-center gap-3">
                <div className="h-4 bg-muted rounded-md w-8" />
                <div className="h-4 bg-muted rounded-md w-8" />
                <div className="h-4 bg-muted rounded-md w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
