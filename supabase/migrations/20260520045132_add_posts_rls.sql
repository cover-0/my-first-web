-- 기존에 같은 이름의 정책이 있다면 충돌 방지를 위해 먼저 안전하게 삭제합니다.
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON posts;

-- 1. posts 테이블 RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 2. SELECT (누구나 읽기)
CREATE POLICY "Enable read access for all users"
ON posts
FOR SELECT
USING (true);

-- 3. INSERT (로그인한 사용자만 본인 이름으로 작성)
CREATE POLICY "Enable insert for authenticated users only"
ON posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. UPDATE (작성자만 수정 가능, 소유권 변경 방지)
CREATE POLICY "Enable update for users based on user_id"
ON posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. DELETE (작성자만 삭제)
CREATE POLICY "Enable delete for users based on user_id"
ON posts
FOR DELETE
USING (auth.uid() = user_id);
