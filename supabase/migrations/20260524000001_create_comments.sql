-- 1. 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. RLS 활성화
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책
-- 누구나 댓글을 읽을 수 있음
CREATE POLICY "Anyone can read comments"
    ON public.comments FOR SELECT
    USING (true);

-- 로그인한 사용자만 댓글을 작성할 수 있음
CREATE POLICY "Users can insert their own comments"
    ON public.comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 로그인한 사용자만 자신의 댓글을 삭제할 수 있음
CREATE POLICY "Users can delete their own comments"
    ON public.comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
