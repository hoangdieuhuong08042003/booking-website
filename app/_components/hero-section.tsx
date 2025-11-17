"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1920&query=luxury%20hotel%20room%20modern%20elegant)",
          opacity: 0.25,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/20 to-accent/30 z-1" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Tìm kiếm khách sạn sang trọng tuyệt vời
            </span>
          </div>

          {/* Main Heading */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
              Khám Phá{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent">
                Những Khách Sạn Tuyệt Vời
              </span>{" "}
              Trên Toàn Thế Giới
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Tìm kiếm, so sánh và đặt phòng tại hơn 500,000 khách sạn, resort
              sang trọng. Giá tốt nhất được đảm bảo, hủy miễn phí, đặt ngay hôm
              nay.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
            >
              Bắt Đầu Tìm Phòng
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#destinations"
              className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-300"
            >
              Xem Khách Sạn Nổi Bật
            </Link>
          </div>

          {/* Stats */}
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                500K+
              </p>
              <p className="text-sm text-foreground/60">Khách Sạn</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">2M+</p>
              <p className="text-sm text-foreground/60">Khách Hàng Hài Lòng</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                24/7
              </p>
              <p className="text-sm text-foreground/60">Hỗ Trợ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
