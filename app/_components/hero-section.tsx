"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image"; // Added import

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                Tìm kiếm khách sạn sang trọng tuyệt vời
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
                Khám Phá{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent">
                  Những Khách Sạn Tuyệt Vời
                </span>{" "}
                Ở Việt Nam
              </h1>
              <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed">
                Tìm kiếm, so sánh và đặt phòng tại hơn 500,000 khách sạn, resort
                sang trọng. Giá tốt nhất được đảm bảo, hủy miễn phí, đặt ngay
                hôm nay.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Bắt Đầu Tìm Phòng
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="#destinations"
                className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-300 text-center"
              >
                Xem Khách Sạn Nổi Bật
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  500K+
                </p>
                <p className="text-sm text-foreground/60">Khách Sạn</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  2M+
                </p>
                <p className="text-sm text-foreground/60">
                  Khách Hàng Hài Lòng
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  24/7
                </p>
                <p className="text-sm text-foreground/60">Hỗ Trợ</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative h-[600px] hidden lg:block">
            {/* Image 1 - Back */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[85%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <Image
                src="/luxury-hotel-exterior-pool.jpg"
                alt="Luxury Hotel Pool"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 85vw"
              />
            </motion.div>

            {/* Image 2 - Middle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="absolute top-[15%] right-0 w-[85%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-20"
            >
              <Image
                src="/luxury-hotel-bedroom-modern.jpg"
                alt="Luxury Hotel Room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 85vw"
              />
            </motion.div>

            {/* Image 3 - Front (Feature card) */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 left-[10%] w-[80%] h-[40%] rounded-2xl overflow-hidden shadow-2xl z-30"
            >
              <Image
                src="/luxury-hotel-spa-relaxation.jpg"
                alt="Luxury Hotel Spa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl z-0"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
