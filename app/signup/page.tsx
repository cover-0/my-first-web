"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await signUpWithEmail(email, password, name);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      
      // 가입 성공 후 2초 뒤에 로그인 페이지로 자동 이동
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  // 성공 시 보여줄 화면
  if (success) {
    return (
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">가입 완료! 🎉</h2>
            <p className="text-gray-600">회원가입이 성공적으로 완료되었습니다.</p>
            <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
            <Button onClick={() => router.push("/login")} className="w-full mt-6">
              지금 로그인하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 기본 회원가입 폼 화면
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                이름
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호 (6자리 이상)"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "가입 처리 중..." : "회원가입"}
            </Button>

            <div className="text-center text-sm text-gray-500 pt-2">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
