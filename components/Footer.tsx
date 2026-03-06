"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-blue-900">
      <div className="max-w-[1250px] mx-auto w-full px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/sigla smart home.svg"
                alt="SmartHomeMall Logo"
                width={40}
                height={40}
                className="w-10 h-10 brightness-0 invert"
              />
              <span className="text-xl font-bold text-white uppercase">
                SmartHomeMall
              </span>
            </Link>
            <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs mb-5">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#29b4b9] transition"
              >
                <FaFacebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#29b4b9] transition"
              >
                <FaInstagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#29b4b9] transition"
              >
                <FaLinkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Pagini */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.pages")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/smart-residence", labelKey: "nav.smartResidence" as const },
                { href: "/smart-comercial", labelKey: "nav.smartComercial" as const },
                { href: "/smart-lighting", labelKey: "nav.smartLighting" as const },
                { href: "/smart-intercom", labelKey: "nav.smartIntercom" as const },
                { href: "/products", labelKey: "nav.products" as const },
                { href: "/despre", labelKey: "nav.about" as const },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200/70 text-sm hover:text-white transition"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.info")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/termeni-conditii"
                  className="text-blue-200/70 text-sm hover:text-white transition"
                >
                  {t("footer.termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-confidentialitate"
                  className="text-blue-200/70 text-sm hover:text-white transition"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:office@smarthomemall.ro"
                  className="flex items-center gap-3 text-blue-200/70 text-sm hover:text-white transition group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#29b4b9] transition flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </span>
                  office@smarthomemall.ro
                </a>
              </li>
              <li>
                <a
                  href="tel:+40712345678"
                  className="flex items-center gap-3 text-blue-200/70 text-sm hover:text-white transition group"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#29b4b9] transition flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </span>
                  +40 712 345 678
                </a>
              </li>
              <li className="flex items-center gap-3 text-blue-200/70 text-sm">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </span>
                {t("footer.address")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-200/50 text-xs">
            &copy; {new Date().getFullYear()} SmartHomeMall. {t("footer.allRightsReserved")}
          </p>
          <div className="flex items-center gap-4 text-blue-200/50 text-xs">
            <Link href="/termeni-conditii" className="hover:text-white transition">
              {t("footer.termsShort")}
            </Link>
            <Link href="/politica-confidentialitate" className="hover:text-white transition">
              {t("footer.privacyShort")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
