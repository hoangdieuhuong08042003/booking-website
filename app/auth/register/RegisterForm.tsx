"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || "新規登録に失敗しました。";
        setError(message);
        toast.error(message);
      } else {
        toast.success("新規登録に成功しました。");
        router.push("/auth/login");
        router.refresh();
      }
    } catch {
      setError(
        "新規登録中に問題が発生しました。しばらくしてからお試しください。"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-md space-y-0">
      <Card className="rounded-b-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-10">
            <Image
              src="/logo.png"
              alt="logo"
              width={64}
              height={64}
              className="h-10 w-10 rounded-md object-contain"
              style={{
                filter:
                  "brightness(var(--logo-brightness)) contrast(var(--logo-contrast))",
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Takasho AI</CardTitle>
          <CardDescription>AIチャットボットプラットフォーム</CardDescription>
        </CardHeader>
      </Card>
      <Card className="rounded-t-none border-t-0">
        <CardContent className="px-8 py-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className=" text-center">
              <h2 className="text-2xl font-bold">新規登録</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                ここであなたのアカウントに変更を加えます。完了したら[保存]をクリックします。
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">名前</label>
              <Input
                type="text"
                placeholder="名前"
                autoComplete="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">メールアドレス</label>
              <Input
                type="email"
                placeholder="m@example"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">パスワード</label>
              </div>
              <Input
                type="password"
                placeholder=""
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">パスワード確認</label>
              </div>
              <Input
                type="password"
                placeholder=""
                autoComplete="current-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>

            {error ? <p className="text-destructive text-sm">{error}</p> : null}

            <Button
              type="submit"
              className="w-full h-11 rounded-md"
              disabled={loading}
            >
              {loading ? "新規登録中..." : "新規登録"}
            </Button>

            <Button
              type="button"
              variant="default"
              className="w-full h-11 rounded-md"
              onClick={() => signIn("google", { callbackUrl })}
            >
              <FcGoogle className="size-6" />
              <span>Googleで新規登録</span>
            </Button>

            <p className="text-muted-foreground mt-2 text-center text-sm">
              アカウントをお持ちの方は？{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                ログイン
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
