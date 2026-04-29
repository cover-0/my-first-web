export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const JSON_PLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com";

function formatDateById(id: number) {
  const day = String((id % 28) + 1).padStart(2, "0");
  return `2026-04-${day}`;
}

function mapJsonPostToPost(item: JsonPlaceholderPost): Post {
  return {
    id: item.id,
    title: item.title,
    content: item.body,
    author: `작성자 ${item.userId}`,
    date: formatDateById(item.id),
  };
}

export async function fetchPosts(limit = 20): Promise<Post[]> {
  const response = await fetch(`${JSON_PLACEHOLDER_BASE_URL}/posts`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }

  const data = (await response.json()) as JsonPlaceholderPost[];
  return data.slice(0, limit).map(mapJsonPostToPost);
}

export async function fetchPostById(id: number): Promise<Post | null> {
  const response = await fetch(`${JSON_PLACEHOLDER_BASE_URL}/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("게시글 상세 정보를 불러오지 못했습니다.");
  }

  const data = (await response.json()) as JsonPlaceholderPost;
  return mapJsonPostToPost(data);
}

// JSONPlaceholder는 create 응답을 반환하지만 서버 데이터는 영구 저장되지 않는다.
export async function createPost(input: Pick<Post, "title" | "content">): Promise<Post> {
  const response = await fetch(`${JSON_PLACEHOLDER_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      title: input.title,
      body: input.content,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("게시글 저장에 실패했습니다.");
  }

  const data = (await response.json()) as JsonPlaceholderPost;
  return mapJsonPostToPost(data);
}

// JSONPlaceholder는 수정 응답만 반환하며 실제 데이터는 변경되지 않는다.
export async function updatePost(
  id: number,
  input: Pick<Post, "title" | "content">
): Promise<Post> {
  const response = await fetch(`${JSON_PLACEHOLDER_BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      title: input.title,
      body: input.content,
    }),
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }

  const data = (await response.json()) as JsonPlaceholderPost;
  return mapJsonPostToPost(data);
}

// JSONPlaceholder는 delete 응답만 반환하며 실제 데이터는 삭제되지 않는다.
export async function deletePost(id: number): Promise<boolean> {
  const response = await fetch(`${JSON_PLACEHOLDER_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });

  return response.ok;
}

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
