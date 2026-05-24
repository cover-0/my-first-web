-- 1. 좋아요 테이블 생성
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    -- 한 유저가 한 게시글에 한 번만 좋아요를 누를 수 있도록 설정
    UNIQUE(post_id, user_id)
);

-- 2. RLS 활성화
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책
-- 누구나 좋아요 목록/숫자를 볼 수 있음
CREATE POLICY "Anyone can read post likes"
    ON public.post_likes FOR SELECT
    USING (true);

-- 로그인한 사용자만 자신의 좋아요를 추가할 수 있음
CREATE POLICY "Users can insert their own likes"
    ON public.post_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 로그인한 사용자만 자신의 좋아요를 취소(삭제)할 수 있음
CREATE POLICY "Users can delete their own likes"
    ON public.post_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
