"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (!result) return;
      if (result.error) {
        setError("Email hoặc mật khẩu không chính xác.");
        setLoading(false);
        return;
      }
      router.push(result.url || callbackUrl);
      router.refresh();
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-0">
      <Card className="rounded-b-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold"> TravelHub</CardTitle>
          <CardDescription>
            {" "}
            Tìm kiếm khách sạn sang trọng tuyệt vời
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="rounded-t-none border-t-0">
        <CardContent className="px-8 py-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className=" text-center">
              <h2 className="text-2xl font-bold">Đăng nhập</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Vui lòng nhập thông tin tài khoản
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="gmail@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mật khẩu</label>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
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

            {error ? <p className="text-destructive text-sm">{error}</p> : null}

            <Button
              type="submit"
              className="w-full h-11 rounded-md"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <Button
              type="button"
              variant="default"
              className="w-full h-11 rounded-md bg-primary text-white "
              onClick={() => signIn("google", { callbackUrl })}
            >
              <FcGoogle className="size-6" />
              <span>Đăng nhập bằng Google</span>
            </Button>

            <p className="text-muted-foreground mt-2 text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
