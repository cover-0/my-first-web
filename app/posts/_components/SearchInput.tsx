"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/posts`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="search"
        placeholder="게시글 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-48 bg-background"
      />
      <Button type="submit" variant="secondary" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">검색</span>
      </Button>
    </form>
  );
}
