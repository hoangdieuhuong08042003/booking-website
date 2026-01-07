"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative min-h-svh w-full bg-gradient-to-br from-primary/20 via-background to-accent/20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/login.png')",
          }}
        />
        <div className="relative z-10 flex min-h-svh items-center justify-center p-4">
          <RegisterForm />
        </div>
      </div>
    </Suspense>
  );
}
