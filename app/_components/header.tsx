"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">
            TravelHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#destinations"
            className="text-foreground/70 hover:text-primary transition"
          >
            Điểm Đến
          </Link>
          <Link
            href="#services"
            className="text-foreground/70 hover:text-primary transition"
          >
            Dịch Vụ
          </Link>
          <Link
            href="#about"
            className="text-foreground/70 hover:text-primary transition"
          >
            Về Chúng Tôi
          </Link>
          <Link
            href="#testimonials"
            className="text-foreground/70 hover:text-primary transition"
          >
            Đánh Giá
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition"
          >
            Đăng Nhập
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-lg hover:shadow-lg transition font-medium"
          >
            Đăng Ký
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="#destinations"
              className="block text-foreground/70 hover:text-primary transition py-2"
            >
              Điểm Đến
            </Link>
            <Link
              href="#services"
              className="block text-foreground/70 hover:text-primary transition py-2"
            >
              Dịch Vụ
            </Link>
            <Link
              href="#about"
              className="block text-foreground/70 hover:text-primary transition py-2"
            >
              Về Chúng Tôi
            </Link>
            <Link
              href="#testimonials"
              className="block text-foreground/70 hover:text-primary transition py-2"
            >
              Đánh Giá
            </Link>
            <div className="pt-4 space-y-2 border-t border-border">
              <Link
                href="/auth/login"
                className="block w-full px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/auth/register"
                className="block w-full px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-lg hover:shadow-lg transition font-medium text-center"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
