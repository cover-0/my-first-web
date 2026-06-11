"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "./_components/AvatarUpload";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 비회원 접근 방지 및 기존 정보 불러오기
  useEffect(() => {
    if (loading) return;

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || null);
      }
      setIsFetching(false);
    };

    fetchProfile();
  }, [user, loading, router, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !username.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          username: username.trim(),
          full_name: fullName.trim(),
          avatar_url: avatarUrl
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("프로필이 성공적으로 변경되었습니다!");
      router.push("/posts"); // 변경 완료 후 글 목록으로 이동 (또는 제자리 유지)
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      alert("닉네임 변경에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isFetching) {
    return <div className="text-center p-10 text-muted-foreground">유저 정보를 불러오는 중...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card border rounded-lg shadow-sm text-card-foreground">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="flex justify-center mb-6">
          <AvatarUpload 
            avatarUrl={avatarUrl} 
            username={username} 
            onUploadSuccess={(url) => setAvatarUrl(url)} 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            이메일 (변경 불가)
          </label>
          <Input 
            id="email" 
            type="email" 
            value={user?.email || ""} 
            disabled 
            className="bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            실명
          </label>
          <Input 
            id="fullName" 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="실명을 입력해주세요"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            닉네임
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용하실 닉네임을 입력해주세요"
            required
          />
        </div>

        <Button type="submit" disabled={isSaving || !username.trim()} className="w-full">
          {isSaving ? "저장 중..." : "변경 사항 저장"}
        </Button>
      </form>
    </div>
  );
}
