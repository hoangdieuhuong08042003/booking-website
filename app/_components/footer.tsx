import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl">TravelHub</span>
            </div>
            <p className="text-white/70">
              Khám phá thế giới cùng chúng tôi. Đặt tour, khách sạn, vé máy bay
              dễ dàng và tiết kiệm.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3 text-white/70">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="#destinations"
                  className="hover:text-white transition"
                >
                  Điểm Đến
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition">
                  Dịch Vụ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold text-lg mb-4">Thông Tin</h4>
            <ul className="space-y-3 text-white/70">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition">
                <Phone size={18} />
                <span>(+84) 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition">
                <Mail size={18} />
                <span>info@travelhub.vn</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-white/70">Theo dõi chúng tôi</p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p>&copy; 2025 TravelHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
