"use client";

import Image from "next/image";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import { useLanguage } from "@/contexts/language-context";
import type { ProductWithVariants } from "@/lib/types";

const houseHotspotsConfig = [
  { x: 20, y: 30, labelKey: "residence.hotspot.hub.label" as const, descKey: "residence.hotspot.hub.desc" as const },
  { x: 40, y: 20, labelKey: "residence.hotspot.lights.label" as const, descKey: "residence.hotspot.lights.desc" as const },
  { x: 75, y: 25, labelKey: "residence.hotspot.intercom.label" as const, descKey: "residence.hotspot.intercom.desc" as const },
  { x: 60, y: 60, labelKey: "residence.hotspot.thermostat.label" as const, descKey: "residence.hotspot.thermostat.desc" as const },
  { x: 30, y: 70, labelKey: "residence.hotspot.blinds.label" as const, descKey: "residence.hotspot.blinds.desc" as const },
  { x: 80, y: 80, labelKey: "residence.hotspot.ac.label" as const, descKey: "residence.hotspot.ac.desc" as const },
];

interface SmartResidenceContentProps {
  products: ProductWithVariants[];
}

export default function SmartResidenceContent({ products }: SmartResidenceContentProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/smart-residence.jpg"
          alt="Smart Residence Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-[1250px] left-1/2 -translate-x-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            {t("residence.hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            {t("residence.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🏠 {t("residence.hero.badge1")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔐 {t("residence.hero.badge2")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              💡 {t("residence.hero.badge3")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🌡️ {t("residence.hero.badge4")}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">{t("residence.explore.title")}</h2>
          <div className="relative w-full max-w-3xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <img src="/img1.jpg" alt="Smart House" className="w-full h-full object-cover" />
            {houseHotspotsConfig.map((dot, idx) => (
              <div
                key={idx}
                className="absolute group"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg cursor-pointer animate-pulse" />
                <div className="absolute left-1/2 top-0 z-10 hidden group-hover:block min-w-[180px] -translate-x-1/2 -translate-y-full bg-white text-blue-900 text-sm rounded-lg shadow-lg px-4 py-2 mt-2">
                  <div className="font-bold">{t(dot.labelKey)}</div>
                  <div>{t(dot.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-4">{t("residence.explore.hint")}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">{t("residence.life.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.life.c1.title")}</h3>
              <p>{t("residence.life.c1.desc")}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.life.c2.title")}</h3>
              <p>{t("residence.life.c2.desc")}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-lg text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.life.c3.title")}</h3>
              <p>{t("residence.life.c3.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center text-6xl text-blue-400">
              🏠
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">{t("residence.what.title")}</h2>
            <p className="text-lg text-gray-700 mb-4">{t("residence.what.p")}</p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>{t("residence.what.li1")}</li>
              <li>{t("residence.what.li2")}</li>
              <li>{t("residence.what.li3")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">{t("residence.help.title")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.help.c1.title")}</h3>
              <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
                <li>{t("residence.help.c1.li1")}</li>
                <li>{t("residence.help.c1.li2")}</li>
                <li>{t("residence.help.c1.li3")}</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.help.c2.title")}</h3>
              <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
                <li>{t("residence.help.c2.li1")}</li>
                <li>{t("residence.help.c2.li2")}</li>
                <li>{t("residence.help.c2.li3")}</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="text-5xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold mb-2">{t("residence.help.c3.title")}</h3>
              <ul className="list-disc text-left pl-4 text-gray-700 space-y-2">
                <li>{t("residence.help.c3.li1")}</li>
                <li>{t("residence.help.c3.li2")}</li>
                <li>{t("residence.help.c3.li3")}</li>
              </ul>
            </div>
          </div>
          <div className="max-w-2xl mx-auto mt-10 text-center text-gray-600 text-base md:text-lg">
            <p>{t("residence.help.closing")}</p>
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-50 py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">{t("residence.products.title")}</h2>
          <div className="mt-8">
            <ProductCarousel products={products} />
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
