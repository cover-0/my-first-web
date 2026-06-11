"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploadProps {
  avatarUrl: string | null;
  username: string | null;
  onUploadSuccess: (url: string) => void;
}

export function AvatarUpload({ avatarUrl, username, onUploadSuccess }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("이미지 파일은 2MB 이하만 가능합니다.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString();
    const fileExt = file.name.split(".").pop();
    const fileName = `${uniqueId}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("아바타 업로드 에러:", uploadError);
        alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
    } catch (err) {
      console.error("예기치 못한 업로드 에러:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div 
        className="relative cursor-pointer group"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <UserAvatar 
          avatarUrl={avatarUrl} 
          username={username} 
          className="w-24 h-24" 
        />
        
        <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">클릭하여 프로필 이미지 변경</p>
    </div>
  );
}
