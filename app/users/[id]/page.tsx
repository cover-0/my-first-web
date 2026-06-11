import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import EditProfileButton from "./_components/EditProfileButton";
import { UserAvatar } from "@/components/UserAvatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UserProfilePage({ params, searchParams }: UserProfilePageProps) {
  const supabase = createClient();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const userId = resolvedParams.id;
  const tab = typeof resolvedSearchParams.tab === "string" ? resolvedSearchParams.tab : "posts";

  // 1. Fetch User Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, full_name, created_at, avatar_url, role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  let posts: any[] = [];
  let likedPosts: any[] = [];
  let comments: any[] = [];

  // 2. Fetch Data Based on Tab
  if (tab === "likes") {
    const { data } = await supabase
      .from("post_likes")
      .select(`
        post_id,
        created_at,
        posts (
          id, title, content, created_at, user_id, view_count,
          post_likes(count), comments(count),
          profiles (username, avatar_url)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) {
      likedPosts = data.map((item: any) => item.posts).filter(Boolean);
    }
  } else if (tab === "comments") {
    const { data } = await supabase
      .from("comments")
      .select(`
        id, content, created_at, post_id,
        posts ( title )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) comments = data;
  } else {
    // Default: 'posts'
    const { data } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id, view_count, post_likes(count), comments(count), profiles(username, avatar_url)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
    if (data) posts = data;
  }

  const renderPostCards = (postList: any[], emptyMessage: string) => {
    if (!postList || postList.length === 0) {
      return (
        <div className="text-center p-12 border border-dashed rounded-lg bg-card/50 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {postList.map((post) => (
          <div
            key={post.id}
            className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md bg-card text-card-foreground"
          >
            <Link href={`/posts/${post.id}`} className="block flex-grow">
              <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
            </Link>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Link href={`/users/${post.user_id}`} className="flex items-center gap-2 group/author">
                  <UserAvatar 
                    avatarUrl={Array.isArray(post.profiles) ? post.profiles[0]?.avatar_url : post.profiles?.avatar_url}
                    username={Array.isArray(post.profiles) ? post.profiles[0]?.username : post.profiles?.username}
                    className="h-5 w-5 transition-transform group-hover/author:scale-110"
                  />
                  <span className="font-medium text-foreground group-hover/author:underline transition-colors">
                    {Array.isArray(post.profiles) ? post.profiles[0]?.username : post.profiles?.username || "익명"}
                  </span>
                </Link>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-green-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>{post.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                  <span>{Array.isArray(post.post_likes) ? post.post_likes[0]?.count : post.post_likes?.count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-blue-500"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                  <span>{Array.isArray(post.comments) ? post.comments[0]?.count : post.comments?.count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-card border rounded-lg p-8 shadow-sm flex flex-col items-center text-center">
        {profile.avatar_url ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105">
                <UserAvatar 
                  avatarUrl={profile.avatar_url} 
                  username={profile.username} 
                  className="w-24 h-24 mb-4 text-muted-foreground cursor-pointer" 
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col items-center justify-center bg-transparent border-none shadow-none">
              <img 
                src={profile.avatar_url} 
                alt={`${profile.username} 확대된 아바타`} 
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            </DialogContent>
          </Dialog>
        ) : (
          <UserAvatar 
            avatarUrl={null} 
            username={profile.username} 
            className="w-24 h-24 mb-4 text-muted-foreground" 
          />
        )}
        <h1 className="text-2xl font-bold text-card-foreground">
          {profile.username || "익명 사용자"}
        </h1>
        {profile.full_name && (
          <p className="text-muted-foreground mt-1">{profile.full_name}</p>
        )}
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>가입일: {new Date(profile.created_at).toLocaleDateString()}</span>
        </div>
        <EditProfileButton profileId={userId} />
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-4 border-b">
        <Link 
          href={`/users/${userId}?tab=posts`}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'posts' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          작성한 글
        </Link>
        <Link 
          href={`/users/${userId}?tab=likes`}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'likes' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          좋아요 한 글
        </Link>
        <Link 
          href={`/users/${userId}?tab=comments`}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === 'comments' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          작성한 댓글
        </Link>
      </div>

      {/* Content Area */}
      <div className="pt-2">
        {tab === "posts" && renderPostCards(posts, "아직 작성한 글이 없습니다.")}
        {tab === "likes" && renderPostCards(likedPosts, "아직 좋아요를 누른 글이 없습니다.")}
        
        {tab === "comments" && (
          <div>
            {!comments || comments.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-lg bg-card/50 text-muted-foreground">
                아직 작성한 댓글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="p-4 rounded-lg border bg-card shadow-sm text-card-foreground flex flex-col gap-2">
                    <Link href={`/posts/${comment.post_id}`} className="text-sm font-medium hover:underline text-primary">
                      원문: {comment.posts?.title || "삭제된 게시글"}
                    </Link>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
