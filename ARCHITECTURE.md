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

## 4. 기술 스택

- Next.js 16.2.1 (App Router)
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- shadcn/ui (components/ui)
- Supabase (Auth, Storage)

## 5. 라우팅 규칙 (App Router)

- 라우트는 app/ 폴더 아래에 둔다.
- 페이지는 page.tsx, 레이아웃은 app/layout.tsx를 사용한다.
- 기본은 Server Component이며, 브라우저 API나 상호작용이 필요할 때만 "use client"를 사용한다.

## 6. 데이터와 상태

- 게시글 데이터는 lib/의 서버 함수로 가져온다.
- 인증은 Supabase Auth (Email)를 사용한다.
- 클라이언트 상태(세션)는 React Context (AuthProvider)로 관리한다.
- 이미지는 Supabase Storage를 사용한다.

## 7. 스타일링 규칙

- 스타일은 Tailwind CSS로 작성한다.
- Tailwind 기본 색상 클래스는 사용하지 않고, CSS 변수 기반 디자인 토큰을 사용한다.
- 기본 레이아웃 규칙:
	- 최대 폭: max-w-4xl mx-auto
	- 섹션 간격: space-y-6
	- 카드 패딩: p-6
	- 반응형: 모바일 1열, md 이상 2열

## 8. UI 컴포넌트

- shadcn/ui 컴포넌트를 우선 사용한다.
- Button, Card, Input, Dialog 등은 components/ui/에서 가져온다.
- 커스텀 컴포넌트는 components/ 루트에 배치한다.

## 9. 폴더 가이드

- app/: 라우트와 레이아웃 (App Router)
- components/: 커스텀 컴포넌트
- components/ui/: shadcn/ui 컴포넌트
- lib/: 공용 유틸과 데이터 헬퍼
- public/: 정적 파일

## 10. 주의사항

- next/router 사용 금지, next/navigation 사용.
- pages/ 생성 금지, App Router만 사용.
- 불필요한 "use client" 사용 금지.
- Tailwind 기본 색상 클래스 사용 금지.
- Server Component에서 useRouter 같은 클라이언트 훅 사용 금지.

## 11. 메모

- Tailwind CSS 4는 globals.css에서 @import "tailwindcss" + @theme를 사용한다.
- Server Component는 클라이언트 훅을 사용할 수 없다.

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
