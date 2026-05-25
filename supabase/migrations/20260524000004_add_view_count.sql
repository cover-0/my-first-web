-- 1. 조회수 컬럼 추가 (기존 글들은 0으로 시작)
ALTER TABLE posts ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;

-- 2. 누구나 안전하게 조회수를 1 올릴 수 있는 함수(RPC) 생성
CREATE OR REPLACE FUNCTION increment_view_count(p_post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE posts SET view_count = view_count + 1 WHERE id = p_post_id;
END;
$$;