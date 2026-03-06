"use client";

import Image from "next/image";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import type { ProductWithVariants } from "@/lib/types";

const processStepKeys = [
  { title: "comercial.process.s1.title" as const, desc: "comercial.process.s1.desc" as const, details: ["comercial.process.s1.d1", "comercial.process.s1.d2", "comercial.process.s1.d3", "comercial.process.s1.d4"] as const, image: "/proiectare.jpg" },
  { title: "comercial.process.s2.title" as const, desc: "comercial.process.s2.desc" as const, details: ["comercial.process.s2.d1", "comercial.process.s2.d2", "comercial.process.s2.d3", "comercial.process.s2.d4"] as const, image: "/design.jpg" },
  { title: "comercial.process.s3.title" as const, desc: "comercial.process.s3.desc" as const, details: ["comercial.process.s3.d1", "comercial.process.s3.d2", "comercial.process.s3.d3", "comercial.process.s3.d4"] as const, image: "/instalare.jpg" },
  { title: "comercial.process.s4.title" as const, desc: "comercial.process.s4.desc" as const, details: ["comercial.process.s4.d1", "comercial.process.s4.d2", "comercial.process.s4.d3", "comercial.process.s4.d4"] as const, image: "/suport.jpg" },
];

interface SmartComercialContentProps {
  products: ProductWithVariants[];
}

export default function SmartComercialContent({ products }: SmartComercialContentProps) {
  const { t } = useLanguage();

  const businessSolutions = [
    {
      icon: "🛍️",
      titleKey: "comercial.solutions.retail.title" as const,
      featureKeys: ["comercial.solutions.retail.f1", "comercial.solutions.retail.f2", "comercial.solutions.retail.f3", "comercial.solutions.retail.f4", "comercial.solutions.retail.f5"] as const,
    },
    {
      icon: "🏨",
      titleKey: "comercial.solutions.hotel.title" as const,
      featureKeys: ["comercial.solutions.hotel.f1", "comercial.solutions.hotel.f2", "comercial.solutions.hotel.f3", "comercial.solutions.hotel.f4", "comercial.solutions.hotel.f5"] as const,
    },
    {
      icon: "🏢",
      titleKey: "comercial.solutions.office.title" as const,
      featureKeys: ["comercial.solutions.office.f1", "comercial.solutions.office.f2", "comercial.solutions.office.f3", "comercial.solutions.office.f4", "comercial.solutions.office.f5"] as const,
    },
  ];

  const benefits = [
    { icon: "📊", key: "comercial.benefits.b1" as const, color: "bg-blue-50" },
    { icon: "💰", key: "comercial.benefits.b2" as const, color: "bg-green-50" },
    { icon: "🔒", key: "comercial.benefits.b3" as const, color: "bg-purple-50" },
    { icon: "📱", key: "comercial.benefits.b4" as const, color: "bg-yellow-50" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
        <Image
          src="/smart-hotel.jpg"
          alt="Smart Commercial Hero"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-[1250px] left-1/2 -translate-x-1/2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            {t("comercial.hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto drop-shadow">
            {t("comercial.hero.subtitle")}
          </p>
          <Button className="bg-white text-blue-800 px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:bg-blue-50 transition-colors">
            {t("comercial.hero.cta")}
          </Button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-slide-up">
            {t("comercial.solutions.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {businessSolutions.map((solution, index) => (
              <div
                key={solution.titleKey}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl mb-6">{solution.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">{t(solution.titleKey)}</h3>
                <ul className="space-y-3">
                  {solution.featureKeys.map((key) => (
                    <li key={key} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-20 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-fade-in">
            {t("comercial.process.title")}
          </h2>
          <div className="space-y-20">
            {processStepKeys.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""} animate-slide-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-semibold text-blue-900">{t(step.title)}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{t(step.desc)}</p>
                  <ul className="grid grid-cols-2 gap-3 mt-4">
                    {step.details.map((key) => (
                      <li key={key} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        {t(key)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 relative">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl relative">
                    <Image
                      src={step.image}
                      alt={t(step.title)}
                      fill
                      className="object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 animate-fade-in">
            {t("comercial.benefits.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.key}
                className={`${benefit.color} p-6 rounded-xl text-center shadow hover:shadow-lg transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-4xl mb-3 block">{benefit.icon}</span>
                <p className="text-sm font-medium text-gray-700">{t(benefit.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-blue-50 py-16 px-4">
        <div className="max-w-[1250px] mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900 animate-fade-in">
            {t("comercial.products.title")}
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
