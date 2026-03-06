"use client";

import Image from "next/image";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import MoodVideo from "@/components/MoodVideo";
import SmartLightingProcess from "@/components/SmartLightingProcess";
import { useLanguage } from "@/contexts/language-context";
import type { ProductWithVariants } from "@/lib/types";

const energySteps = [
  { icon: "💡", key: "lighting.energy.e1" as const },
  { icon: "🌞", key: "lighting.energy.e2" as const },
  { icon: "🌱", key: "lighting.energy.e3" as const },
  { icon: "📱", key: "lighting.energy.e4" as const },
  { icon: "🔋", key: "lighting.energy.e5" as const },
];

interface SmartLightingContentProps {
  products: ProductWithVariants[];
}

export default function SmartLightingContent({ products }: SmartLightingContentProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/pozq-light.png"
          alt="Smart Lighting Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-6xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            {t("lighting.hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            {t("lighting.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              💡 {t("lighting.hero.badge1")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🌈 {t("lighting.hero.badge2")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔋 {t("lighting.hero.badge3")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              📱 {t("lighting.hero.badge4")}
            </span>
          </div>
        </div>
      </section>

      <SmartLightingProcess />

      <section className="relative w-full py-20 px-4 md:px-0 bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t("lighting.energy.title")}
            </h2>
            <div className="relative pl-8 md:pl-0">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-200 rounded-full md:hidden" />
              <ul className="space-y-10 md:space-y-0 flex flex-col md:flex-row md:items-center md:gap-12">
                {energySteps.map((step, i) => (
                  <li key={step.key} className="relative flex items-center md:flex-col md:items-start group">
                    <span className="absolute -left-8 md:static md:mb-2 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl shadow-lg">
                      {step.icon}
                    </span>
                    <span className="bg-blue-100 rounded-xl px-4 py-2 shadow-md">
                      {t(step.key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <Image
              src="/sigla smart home.svg"
              alt="Smart Lighting"
              width={320}
              height={320}
              className="rounded-full shadow-2xl bg-white p-8"
            />
          </div>
        </div>
      </section>

      <MoodVideo />

      <section className="w-full bg-blue-50 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">
            {t("lighting.products.title")}
          </h2>
          <div className="mt-8">
            <ProductCarousel products={products} />
          </div>
        </div>
      </section>
      <Newsletter />
    </main>
  );
}
