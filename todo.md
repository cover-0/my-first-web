# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [x] Supabase 프로젝트 생성 (Ch8)
- [x] 데이터베이스 스키마 작성 및 CLI 연동 (Ch8)

## 2단계: 핵심 기능 (Ch9~10)

- [x] 로그인/회원가입 (이메일/비밀번호 전용) (Ch9)
  - [x] lib/auth.ts 함수 작성 (signInWithPassword 등)
  - [x] app/login 페이지 구현
  - [x] app/signup 페이지 구현
  - [x] 회원가입 구현
  - [x] 로그인 구현
  - [x] 로그아웃 구현
  - [x] AuthProvider, useAuth 구현
  - [x] Header 로그인 상태 분기 (비로그인: 로그인/회원가입, 로그인: 글쓰기/로그아웃)
  - [x] middleware.ts 보호 라우트 (/posts/new) 구현
- [x] 게시글 CRUD 작업 (Ch10)
  - [x] 목록 조회 로직 적용 (Supabase)
  - [x] 상세 조회 로직 적용 (Supabase)
  - [x] 새로운 글 작성 로직 최초 적용 (Supabase)
  - [x] 글 수정 기능 (UX)
  - [x] 글 삭제 기능 (UX)
- [x] npm run build 검증 — 빌드 성공 (최종)
- [x] Vercel 배포 URL 검증 — Production Branch를 exp로 변경 완료 (2026-05-13)

## 3단계: 고급 기능 (Ch11~12)

- [x] Ch11 Row Level Security (RLS) 적용
  - [x] posts 테이블 RLS 마이그레이션 생성
  - [x] db push로 원격 DB 적용
  - [x] 다른 계정 우회 테스트 검증
  - [x] 보안 키 노출 여부 점검
  - [x] 빌드/배포 검증
- [x] 마이페이지 (닉네임/실명 변경) (Ch12+)
- [x] 댓글 기능 (댓글 작성/수정/삭제, RLS 보안 적용) (Ch12+)
- [x] 좋아요 기능 (Optimistic UI, RLS 보안 적용) (Ch12+)
- [x] 조회수 기능 (RPC, 로컬스토리지 중복 방지) (Ch12+)

## 4단계: 에러 처리와 UX 완성 (Ch12)

### 12.2 loading/error/not-found/empty state
- [x] app/posts/loading.tsx 생성 (목록 스켈레톤)
- [x] app/posts/[id]/loading.tsx 생성 (상세 스켈레톤)
- [x] app/posts/error.tsx 생성 (에러 바운더리 + reset 복구)
- [x] app/not-found.tsx 생성 (글로벌 404)
- [x] app/posts/page.tsx 수정 (Empty State 고도화)

### 12.3 폼 유효성 검증
- [x] app/posts/new/page.tsx 수정 (제목 최소 2자, 내용 최소 10자, 필드별 에러, 제출 중 disabled)

### 12.4 에러 메시지 유틸 및 인증 폼 연동
- [x] lib/error-message.ts 생성 (에러 번역 유틸 — RLS/네트워크/Auth 등 7종 매핑)
- [x] app/login/page.tsx 수정 (에러 번역 적용 + console.error 분리)
- [x] app/signup/page.tsx 수정 (에러 번역 적용 + console.error 분리)

### 12.5 검증
- [x] npm run build — 빌드 성공
- [x] git grep — service_role / next/router / auth.signIn 미검출

## 5단계: AI 결과물 검증 (Ch13)

- [x] 13.1 Playwright E2E 테스트 환경 구축 및 테스트 작성
- [x] 13.1 Playwright E2E 로컬 통과 (Chromium, Firefox)
- [x] 13.2 전체 프로젝트 코드 리뷰 통과 (보안, 데이터, 미들웨어 점검 완)
- [x] 13.3 Vercel 환경변수 세팅 및 배포 URL 수동 시나리오 검증

## 6단계: 보너스 기능 추가 (G5, G6)

- [x] G6 다크 모드 (next-themes)
  - [x] `ThemeProvider` 셋업 및 `html` 태그 `suppressHydrationWarning` 적용
  - [x] `ThemeToggle` 컴포넌트 및 Header.tsx 시맨틱 컬러 리팩토링
  - [x] `globals.css` 부드러운 다크 그레이 톤(#202124 느낌) 재조정
- [x] G5 검색 기능
  - [x] `SearchInput` 클라이언트 컴포넌트 추가
  - [x] `app/posts/page.tsx`에 `searchParams.q` 활용한 Supabase `.ilike()` 쿼리 적용
  - [x] 페이지네이션 링크(`/posts?page=2&q=...`)에 검색어 쿼리 유지

## 진행률: 45/45 (100%)