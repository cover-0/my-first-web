"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
};

type CommentSectionProps = {
  postId: string;
  initialComments: Comment[];
};

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({ post_id: postId, user_id: user.id, content: newComment.trim() })
        .select("*, profiles(username, avatar_url)")
        .single();

      if (error) throw error;
      
      // 작성 성공 시, 클라이언트 상태 업데이트 (낙관적 UI 보완)
      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };

  const handleUpdate = async (commentId: string) => {
    const trimmed = editContent.trim();
    if (!trimmed) return;

    // Optimistic UI: 화면 상태를 먼저 반영합니다.
    const previousComments = [...comments];
    setComments(comments.map((c) => c.id === commentId ? { ...c, content: trimmed } : c));
    setEditingCommentId(null);

    try {
      const { error } = await supabase
        .from("comments")
        .update({ content: trimmed })
        .eq("id", commentId);

      if (error) throw error;
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
      setComments(previousComments); // 실패 시 복원
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    // Optimistic Delete: 화면에서 먼저 지움
    const previousComments = [...comments];
    setComments(comments.filter((c) => c.id !== commentId));

    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
      setComments(previousComments); // 실패 시 원상복구
    }
  };

  return (
    <div className="mt-12 space-y-6 pt-8 border-t">
      <h3 className="text-xl font-semibold">댓글 ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={user ? "댓글을 남겨보세요." : "로그인 후 댓글을 작성할 수 있습니다."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || isSubmitting}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!user || isSubmitting || !newComment.trim()}>
            {user ? "댓글 등록" : "로그인 필요"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-lg bg-card border text-card-foreground">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/users/${comment.user_id}`} className="font-medium text-sm hover:underline">
                {/* Supabase 조인 배열/객체 리턴 구조 예외처리 */}
                {Array.isArray(comment.profiles) 
                  ? comment.profiles[0]?.username 
                  : comment.profiles?.username || "알 수 없음"}
              </Link>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {editingCommentId === comment.id ? (
              <div className="space-y-3 mt-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingCommentId(null)}
                    className="h-8 text-xs"
                  >
                    취소
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdate(comment.id)}
                    disabled={!editContent.trim()}
                    className="h-8 text-xs"
                  >
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                {user?.id === comment.user_id && (
                  <div className="mt-3 flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleStartEdit(comment.id, comment.content)}
                      className="h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      수정
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(comment.id)}
                      className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
