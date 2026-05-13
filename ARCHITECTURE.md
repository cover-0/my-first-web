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

### 3.3 마이페이지

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

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## 6. 데이터와 상태

- 게시글 데이터는 lib/의 서버 함수로 가져온다.
- 인증은 Supabase Auth (Email/Password 전용)를 사용한다. (소셜 로그인 금지, signInWithPassword 사용)
- 클라이언트 상태(세션)는 React Context (AuthProvider)로 관리한다.
- 이미지는 Supabase Storage를 사용한다.

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
- components/: 커스텀 컴포넌트
- components/ui/: shadcn/ui 컴포넌트
- lib/: 공용 유틸과 데이터 헬퍼
- public/: 정적 파일

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

## 11. 메모

- Tailwind CSS 4는 globals.css에서 @import "tailwindcss" + @theme를 사용한다.
- Server Component는 클라이언트 훅을 사용할 수 없다.

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## 컴포넌트 구조

- **페이지 레이아웃 (`app/layout.tsx`)**
  - 헤더 (네비게이션 링크, 로고, 프로필 등)
  - 메인 콘텐츠 영역 (page.tsx 렌더링)
  - 푸터
- **공통 UI 컴포넌트 (`components/ui/`) - shadcn/ui**
  - `Card`: 포스트 목록 및 상세 아이템 감싸기
  - `Button`: 글쓰기, 제출, 삭제 등의 액션 트리거
  - `Input`: 검색어 입력, 포스트 제목 등의 텍스트 폼
  - `Dialog`: 삭제 확인 등의 모달 상호작용
- **도메인 컴포넌트 (`components/`)**
  - `PostCard`: 포스트 목록에서 사용
  - `PostForm`: 포스트 작성 및 수정 페이지에서 재사용

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
