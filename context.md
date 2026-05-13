# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, 포스트 상세 페이지, 포스트 작성 (CRUD), 페이지 맵 및 아키텍처 설계 보강, shadcn/ui 환경 세팅 완료
- 진행 중: 로그인/회원가입
- 미착수: 마이페이지

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용

## Ch9 Supabase Auth 기준
- 인증: 이메일/비밀번호 인증만 사용 (소셜 로그인 불가)
- API: `signInWithPassword` 사용 (`auth.signIn()` 불가)
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 사용
- 키 보안: `service_role` 키는 클라이언트에 절대 두지 않음
- 보호 라우트: `middleware.ts` 사용

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.