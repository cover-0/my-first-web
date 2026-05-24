-- 1. profiles 테이블에 실명(full_name) 컬럼 추가
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. 사용자 가입 시 실행되는 트리거 함수(handle_new_user) 업데이트
-- 이제 메타데이터에서 full_name(실명)과 nickname(닉네임)을 분리해서 가져옵니다.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)), -- 닉네임이 없으면 이메일 앞자리
    new.raw_user_meta_data->>'full_name', -- 실명
    null,
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;