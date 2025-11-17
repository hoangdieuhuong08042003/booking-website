"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            router.replace("/dashboard");
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="relative min-h-svh w-full bg-[url('/login.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex min-h-svh items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
