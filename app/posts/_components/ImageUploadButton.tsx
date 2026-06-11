"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function ImageUploadButton({ onUploadSuccess, disabled }: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 초기화하여 같은 파일 다시 선택 가능하게 함
    e.target.value = "";

    // 유효성 검사
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 파일은 5MB 이하만 가능합니다.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    
    // 유니크한 파일명 생성 (브라우저 내장 randomUUID 또는 fallback)
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString();
    const fileExt = file.name.split(".").pop();
    const fileName = `${uniqueId}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("post_images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("이미지 업로드 에러:", uploadError);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsUploading(false);
        return;
      }

      // Public URL 가져오기
      const { data } = supabase.storage.from("post_images").getPublicUrl(filePath);
      
      onUploadSuccess(data.publicUrl);
    } catch (err) {
      console.error("예기치 못한 업로드 에러:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
        {isUploading ? "업로드 중..." : "이미지 추가"}
      </Button>
    </div>
  );
}
