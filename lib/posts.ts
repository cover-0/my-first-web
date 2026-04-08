export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content: "React 19에서 달라진 점을 초보자 관점에서 정리한 글입니다.",
    author: "김코딩",
    date: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content: "Tailwind CSS 4에서 달라진 핵심 문법과 사용 팁을 소개합니다.",
    author: "이디자인",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content: "Next.js 16 App Router의 기본 구조와 라우팅 흐름을 설명합니다.",
    author: "박개발",
    date: "2026-03-25",
  },
];
