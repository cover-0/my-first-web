AGENTS.md를 참조한다.

# Copilot Instructions

## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

## Coding Conventions   

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

- Primary color: shadcn/ui --primary (어두운 파란색 계열)
- Background: --background (흰색)
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준: Next.js 16.2.1, @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## Database Schema Rules
데이터 모델 및 컬럼명은 Ch8 기준을 따르며 코딩 시 임의로 바꾸지 않는다.
- **posts**: `id` (uuid, primary key), `user_id` (uuid, references profiles(id)), `title` (text), `content` (text), `created_at` (timestamptz)
- **profiles**: `id` (uuid, primary key, references auth.users(id)), `username` (text), `avatar_url` (text), `role` (text)

## Known AI Mistakes & Strict Usage Rules

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.
- Do not use or expose `service_role` (or `SUPABASE_SERVICE_ROLE`, `sb_secret_`) secret keys anywhere inside client components or public variables.
- **[Ch11 Security Rule] 보안은 클라이언트의 if문 분기가 아니라, 반드시 데이터베이스의 RLS(Row Level Security) 제약을 통해 강제한다.**
- **[Ch11 Security Rule] RLS SQL 코드는 Supabase 대시보드 직접 입력방식이 아닌, `supabase/migrations/` 폴더 내에 마이그레이션 파일로 남긴다.**
- **[Ch11 Security Rule] 어떠한 경우에도 `service_role` 키를 클라이언트 코드 등 외부에 노출되는 곳에서 사용하지 않는다.**

## Ch10 Posts CRUD Rules
- Ch8의 `lib/supabase/client.ts`를 사용한다.
- Ch9의 `useAuth/AuthProvider`를 사용한다.
- posts 컬럼명은 Ch8 스키마 그대로 사용한다.
- 수정/삭제 UI는 UX이고, 실제 보안은 Ch11 RLS에서 처리한다.

## Ch9 Supabase Auth Rules
- 이메일/비밀번호 인증만 사용한다. 소셜 로그인은 추가하지 않는다.
- Supabase Auth 로그인은 `signInWithPassword`를 사용한다. 구버전 `auth.signIn()`은 사용하지 않는다.
- `service_role` 키는 클라이언트에 절대 두지 않는다.
- Ch8 환경변수 이름을 유지한다: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 보호 라우트 파일로 `middleware.ts`를 사용한다.
- App Router만 사용한다. `next/router` 금지, `next/navigation` 사용.
- 패키지 버전은 Ch7·Ch8 교재 기준을 따른다 (Version Policy 참조).
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준이다.