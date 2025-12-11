"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowContent(true);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-700 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 text-center">
          {/* Success Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-60 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full p-4 shadow-xl">
                <CheckCircle2
                  className="w-14 h-14 text-white animate-bounce-in"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 animate-slide-in-from-bottom">
              Đặt phòng thành công!
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-2 animate-slide-in-from-bottom animation-delay-100">
              Cảm ơn bạn đã tin tưởng chúng tôi
            </p>

            {/* Confirmation Message */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700/50 dark:to-slate-700/50 rounded-2xl p-5 mt-6 border border-emerald-100 dark:border-slate-600 animate-slide-in-from-bottom animation-delay-200">
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
                Đơn đặt phòng của bạn sẽ được xác nhận qua email.{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Chúng tôi sẽ liên hệ bạn trong vòng 24 giờ.
                </span>
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => router.push("/dashboard/mybookings")}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 animate-slide-in-from-bottom animation-delay-300"
            >
              Xem đơn đặt phòng của tôi
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 animate-slide-in-from-bottom animation-delay-400"
            >
              Quay về Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
