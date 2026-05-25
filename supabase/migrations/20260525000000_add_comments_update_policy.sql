-- 1. 로그인한 사용자만 자신의 댓글을 수정(UPDATE)할 수 있도록 RLS 정책 생성
CREATE POLICY "Users can update their own comments"
    ON public.comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
