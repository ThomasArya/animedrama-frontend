import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlaySquare,
  Heart,
  Shield,
  Github,
  Linkedin,
  MessageCircle,
  Facebook,
  Mail,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-850 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center">
                <PlaySquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Thomas<span className="text-brand-400">MOVIE</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Platform streaming modern untuk menonton anime dan drama favorit.
              Menampilkan antarmuka responsif, fitur pelacakan tontonan, dan
              pengalaman nonton yang lancar.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-4 h-4 shrink-0" />
              <span>
                100% GRATIS DAN DAPAT DI NIKMATI DIMNA SAJA & KAPAN SAJA
              </span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?type=anime"
                  className="hover:text-white transition-colors"
                >
                  Katalog Anime
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?type=drama"
                  className="hover:text-white transition-colors"
                >
                  Katalog Drama Korea & Asia
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-white transition-colors"
                >
                  Semua Konten
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Genre Populer */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Genre
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/catalog?genre=action"
                  className="hover:text-white transition-colors"
                >
                  Action & Pertarungan
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?genre=romance"
                  className="hover:text-white transition-colors"
                >
                  Romance & Percintaan
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?genre=fantasy"
                  className="hover:text-white transition-colors"
                >
                  Fantasy & Sihir
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?genre=comedy"
                  className="hover:text-white transition-colors"
                >
                  Komedi & Santai
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Akun & Fitur */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Akun & Bantuan
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition-colors"
                >
                  Daftar Pengguna Baru
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors"
                >
                  Watchlist & Riwayat
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Kontak & Media Sosial */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak & Media
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/ThomasArya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/thomas-arya-456953428?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 shrink-0" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1CK5hgFWhm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4 shrink-0" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6285357738593"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:suramitahsya@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-850 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} ThomasMOVIE. Menyediakan pengalaman
            menonton anime dan drama terbaik secara gratis dan bebas iklan{" "}
          </p>
          <div className="flex items-center space-x-1">
            <span>Didesain</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
            <span>dengan sebaik mungkin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

