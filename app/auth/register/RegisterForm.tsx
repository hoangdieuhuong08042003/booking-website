"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
        const message = data?.error || "Đăng ký không thành công.";
        setError(message);
        toast.error(message);
      } else {
        toast.success("Đăng ký thành công.");
        router.push("/auth/login");
        router.refresh();
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    } finally {
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
              <h2 className="text-2xl font-bold">Đăng ký</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Tạo tài khoản mới để bắt đầu. Điền thông tin bên dưới.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                type="text"
                placeholder="Nhập họ và tên"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="m@example.com"
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
              </div>
              <Input
                type="password"
                placeholder=""
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Xác nhận mật khẩu</label>
              </div>
              <Input
                type="password"
                placeholder=""
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="h-11 rounded-md"
              />
            </div>

            {error ? <p className="text-destructive text-sm">{error}</p> : null}

            <Button
              type="submit"
              className="w-full h-11 rounded-md "
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <Button
              type="button"
              variant="default"
              className="w-full h-11 rounded-md  "
              onClick={() => signIn("google", { callbackUrl })}
            >
              <FcGoogle className="size-6" />
              <span>Đăng ký bằng Google</span>
            </Button>

            <p className="text-muted-foreground mt-2 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
