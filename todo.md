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

- [ ] 마이페이지
- [ ] 댓글 기능

## 진행률: 14/16 (88%)