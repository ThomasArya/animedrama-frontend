import React from "react";
import {
  Github,
  Linkedin,
  MessageCircle,
  Facebook,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const contactItems = [
  {
    label: "GitHub",
    value: "github.com/ThomasArya",
    href: "https://github.com/ThomasArya",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
  {
    label: "WhatsApp",
    value: "Chat WhatsApp",
    href: "https://wa.me/",
    icon: MessageCircle,
  },
  {
    label: "Facebook",
    value: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    label: "Email",
    value: "thomas@example.com",
    href: "mailto:thomas@example.com",
    icon: Mail,
  },
];

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hubungi <span className="text-brand-400">Kami</span>
          </h1>
          <p className="text-gray-400 mt-4">
            Ada pertanyaan, kritik, atau saran? Kami siap mendengar. Pilih salah
            satu kontak di bawah untuk terhubung dengan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-dark-900 border border-dark-800 rounded-2xl hover:border-brand-500/50 hover:bg-dark-850 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-brand-500/15 text-brand-300 group-hover:bg-brand-500/25 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-dark-900 border border-dark-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-dark-800 text-gray-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Jam Operasional
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Memiliki pertanyaan tentang akun, pembayaran, atau masalah
                teknis lainnya? Hubungi kami kapan saja, 24/7 - kami siap
                membantu.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-dark-800 text-gray-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Alamat</h3>
              <p className="text-sm text-gray-400 mt-1">
                ThomasMOVIE adalah platform streaming online, jadi kami bisa
                dihubungi dari mana saja. Cukup pilih saluran kontak di atas.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};