# ARCHITECTURE

이 문서는 개인 블로그 프로젝트의 아키텍처 뼈대를 정리한 문서입니다. (Next.js App Router 기준)

## 1. 프로젝트 목표

- 글을 쉽고 빠르게 읽을 수 있는 개인 블로그 제공
- 글 작성과 관리가 가능한 기본 CRUD 흐름 제공
- 마이페이지에서 내 글과 계정을 관리할 수 있도록 확장 가능하게 설계

## 2. 페이지 맵 (URL 구조 포함)

- / : 홈
- /posts : 글 목록
- /posts/[id] : 글 상세
- /posts/new : 글 작성
- /posts/[id]/edit : 글 수정
- /login : 로그인
- /signup : 회원가입
- /mypage : 마이페이지

## 3. 유저 플로우

### 3.1 글 읽기

1) 사용자가 /posts에서 글 목록을 확인
2) 특정 글을 선택해 /posts/[id]로 이동
3) 글 상세 내용을 읽고 목록으로 복귀

### 3.2 글 작성

1) 사용자가 /posts/new로 이동
2) 제목/내용을 입력하고 저장
3) 저장 후 /posts 또는 /posts/[id]로 이동

### 3.3 인증 흐름 (Ch9)

1) 사용자가 /signup에서 회원가입 (이메일/비밀번호)
2) /login에서 로그인
3) 로그인 후 /posts 등 보호 페이지 접근 가능
4) Header에서 로그아웃 가능

### 3.4 Header 상태 분기

- **비로그인 상태**: 로그인 버튼, 회원가입 버튼 표시
- **로그인 상태**: 글쓰기 버튼, 로그아웃 버튼 표시

### 3.5 보호 라우트

| 경로 | 조건 | 리다이렉트 |
|------|------|------------|
| `/posts/new` | 비로그인 시 | `/login` |
| `/posts/[id]/edit` | 비로그인 시 또는 작성자가 아닐 시 | `/login` 또는 상세 페이지 |

- `middleware.ts`에서 `@supabase/ssr`의 `createServerClient`로 전역 보호
- 삭제/수정 버튼은 `PostActions.tsx`에서 클라이언트단 상태 (`user.id === post.user_id`) 조건부 렌더링으로 UX 보호 처리

### 3.6 마이페이지 (미구현)

1) 사용자가 /mypage로 이동
2) 내 정보 및 내 글 목록 확인
3) 필요 시 글 수정/삭제로 이동

## Tech Stack

- Next.js 16.2.1 (App Router)
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- shadcn/ui (components/ui)
- Supabase (Auth, Storage)
  - 교재 기준: @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
  - 현재 설치 기준: @supabase/supabase-js ^2.105.1, @supabase/ssr ^0.10.2

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## 6. 데이터와 상태

- 게시글 데이터는 lib/supabase/client.ts 를 이용해 가져온다. (Ch10 기준)
- 게시글 컬럼명 및 데이터 모델은 Ch8 스키마를 엄격히 따른다. 임의 변경을 금지한다.
  - **posts**: `id` (uuid, pk), `user_id` (uuid, fk -> profiles(id)), `title` (text), `content` (text), `created_at` (timestamptz)
  - **profiles**: `id` (uuid, pk, fk -> auth.users(id)), `username` (text), `avatar_url` (text), `role` (text)
- 게시글 수정 및 삭제에 대한 권한 제어 UI 구성은 현재 UX 관점으로 처리하며, **실제 보안은 RLS(Row Level Security)가 담당한다 (Ch11 기준).**
- **RLS 규칙**:
  - RLS는 대시보드 SQL Editor 직접 실행이 아니라 **Supabase CLI 마이그레이션 파일로 기록**하고 적용한다.
  - `posts` 테이블의 `user_id`와 `auth.uid()`를 기준으로 정책을 만든다.
  - 클라이언트 환경에서 `service_role` 키는 절대 사용하지 않는다. (보안 우회 방지)
- 인증은 Supabase Auth (Email/Password 전용)를 사용한다. (소셜 로그인 금지, signInWithPassword 사용)
- 클라이언트 상태(세션)는 React Context (AuthProvider, useAuth)로 관리한다.
- 이미지는 Supabase Storage를 사용한다.

## 7. 시스템 보안 계층 (Ch11 기준)

- **UX 레벨 분기 (Frontend)**: 클라이언트 컴포넌트(`PostActions.tsx` 등)에서 로그인한 유저 ID(`user.id`)와 글 작성자 ID(`post.user_id`)를 비교해 수정/삭제 버튼 노출 여부를 결정합니다. 이는 사용자 경험(UX)을 위한 1차 처리입니다.
- **DB 보안 레벨 (RLS)**: 실제 데이터 보호는 Supabase의 RLS(Row Level Security)를 통해 DB 레벨에서 강제합니다. 클라이언트 사이드 제한을 우회하는 API 호출이나 변조 시도가 있더라도 접근을 완벽히 차단합니다.
- **보호 정책 목록 (RLS Policies)**:
  - **읽기 (SELECT)**: 누구나 접근 가능 (`USING (true)`)
  - **생성 (INSERT)**: 로그인 사용자(auth) 필수 & 본인 ID(`auth.uid() = user_id`)로만 생성 가능
  - **수정 (UPDATE) / 삭제 (DELETE)**: 로그인 사용자 필수 & 작성자(`auth.uid() = user_id`) 본인만 수정/삭제 가능

## Design Tokens

- Primary color: shadcn/ui --primary
- Background: --background
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## 9. 폴더 가이드

- app/: 라우트와 레이아웃 (App Router)
  - app/login/: 로그인 페이지
  - app/signup/: 회원가입 페이지
  - app/not-found.tsx: 글로벌 404 페이지
  - app/posts/loading.tsx: 목록 스켈레톤 로딩
  - app/posts/error.tsx: `/posts` 하위 에러 바운더리 (`"use client"`)
  - app/posts/[id]/loading.tsx: 상세 스켈레톤 로딩
- components/: 커스텀 컴포넌트 (Header.tsx 등)
- components/ui/: shadcn/ui 컴포넌트
- contexts/: React Context (AuthContext.tsx)
- lib/: 공용 유틸과 데이터 헬퍼 (auth.ts, supabaseClient.ts, error-message.ts 등)
- public/: 정적 파일
- middleware.ts: 보호 라우트 미들웨어 (루트)

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

## 11. 메모

- Tailwind CSS 4는 globals.css에서 @import "tailwindcss" + @theme를 사용한다.
- Server Component는 클라이언트 훅을 사용할 수 없다.

## 12. 에러 처리 전략 (Ch12)

### Next.js App Router 내장 파일 컨벤션

| 파일 | 역할 | 위치 |
|------|------|------|
| `loading.tsx` | 데이터 로딩 중 스켈레톤 UI 표시 | `app/posts/`, `app/posts/[id]/` |
| `error.tsx` | 런타임 에러 격리 및 복구 (`"use client"` 필수) | `app/posts/` |
| `not-found.tsx` | 404 페이지 (`notFound()` 또는 미매칭 라우트) | `app/` (글로벌) |

### 에러 메시지 원칙

- **사용자 화면**: `getFriendlyErrorMessage()` 유틸로 변환된 친절한 한글 메시지만 노출
- **개발자 콘솔**: `console.error()`로 원본 에러 객체 상세 기록
- **보안**: Supabase 내부 구조, 테이블명, 에러 스택 등 기술 정보는 절대 사용자에게 노출하지 않음

### 에러 변환 유틸 (`lib/error-message.ts`)

`getFriendlyErrorMessage(error)` 함수가 에러 객체의 `code`/`message`를 분석하여 다음 규칙으로 변환:
- RLS 권한 위반 (42501) → 권한 없음 안내
- 네트워크 단절 (Failed to fetch) → 인터넷 확인 안내
- 자원 미발견 (PGRST116) → 게시글 없음 안내
- 인증 실패 (invalid credentials) → 이메일/비밀번호 확인 안내
- 기타 → 일시적 오류 재시도 안내

적용 페이지: `app/login/page.tsx`, `app/signup/page.tsx`, `app/posts/new/page.tsx`

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## 컴포넌트 구조

- **페이지 레이아웃 (`app/layout.tsx`)**
  - AuthProvider (인증 상태 전역 제공)
  - 헤더 (로그인 상태에 따른 메뉴 분기)
  - 메인 콘텐츠 영역 (page.tsx 렌더링)
  - 푸터
- **공통 UI 컴포넌트 (`components/ui/`) - shadcn/ui**
  - `Card`: 포스트 목록 및 상세 아이템 감싸기
  - `Button`: 글쓰기, 제출, 삭제 등의 액션 트리거
  - `Input`: 검색어 입력, 포스트 제목 등의 텍스트 폼
  - `Dialog`: 삭제 확인 등의 모달 상호작용
- **도메인 컴포넌트 (`components/`)**
  - `Header`: 로그인 상태 분기 (비로그인: 로그인/회원가입, 로그인: 글쓰기/로그아웃)
  - `PostCard`: 포스트 목록에서 사용
  - `PostForm`: 포스트 작성 및 수정 페이지에서 재사용
- **인증 (`contexts/`, `lib/`)**
  - `AuthContext.tsx`: AuthProvider, useAuth 훅
  - `auth.ts`: signUp, signIn, signOut 래핑 함수

## 데이터 모델

### `profiles` (사용자)
- `id`: uuid (PK, auth.users 참조)
- `username`: text
- `avatar_url`: text
- `created_at`: timestamptz

### `posts` (포스트)
- `id`: uuid (PK)
- `user_id`: uuid (FK → profiles.id)
- `title`: text
- `content`: text
- `created_at`: timestamptz
