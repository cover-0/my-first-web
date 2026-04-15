"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div>
      <label htmlFor="post-search" className="mb-2 block text-sm font-medium text-gray-700">
        게시글 검색 (제목 + 작성자)
      </label>
      <input
        id="post-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
      />
    </div>
  );
}