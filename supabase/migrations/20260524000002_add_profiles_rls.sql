-- 1. profiles 테이블 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. RLS 정책 설정
-- 누구나 다른 사람의 프로필(닉네임, 사진 등)을 볼 수 있음
CREATE POLICY "Anyone can read profiles"
    ON public.profiles FOR SELECT
    USING (true);

-- 본인의 프로필 정보만 수정 가능
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
