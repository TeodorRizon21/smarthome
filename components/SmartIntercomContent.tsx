"use client";

import Image from "next/image";
import IntercomSetup from "@/components/IntercomSetup";
import IntercomFeatures from "@/components/IntercomFeatures";
import Newsletter from "@/components/Newsletter";
import { useLanguage } from "@/contexts/language-context";

const useCasesConfig = [
  { icon: "👨‍👩‍👧‍👦", titleKey: "intercom.usecases.family.title" as const, scenarioKeys: ["intercom.usecases.family.s1", "intercom.usecases.family.s2", "intercom.usecases.family.s3", "intercom.usecases.family.s4"] as const },
  { icon: "🏢", titleKey: "intercom.usecases.business.title" as const, scenarioKeys: ["intercom.usecases.business.s1", "intercom.usecases.business.s2", "intercom.usecases.business.s3", "intercom.usecases.business.s4"] as const },
  { icon: "🏖️", titleKey: "intercom.usecases.vacation.title" as const, scenarioKeys: ["intercom.usecases.vacation.s1", "intercom.usecases.vacation.s2", "intercom.usecases.vacation.s3", "intercom.usecases.vacation.s4"] as const },
];

export default function SmartIntercomContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-900 overflow-hidden">
        <Image
          src="/smart-intercom.jpg"
          alt="Smart Intercom"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply" />
        <div className="absolute z-10 text-center w-full px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            {t("intercom.hero.title")}
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 mb-6 max-w-3xl mx-auto drop-shadow">
            {t("intercom.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🎥 {t("intercom.hero.badge1")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔐 {t("intercom.hero.badge2")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              📱 {t("intercom.hero.badge3")}
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              🔔 {t("intercom.hero.badge4")}
            </span>
          </div>
        </div>
      </section>

      <IntercomSetup />
      <IntercomFeatures />

      <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-indigo-900">
            {t("intercom.usecases.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCasesConfig.map((useCase) => (
              <div
                key={useCase.titleKey}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">{t(useCase.titleKey)}</h3>
                <ul className="space-y-3">
                  {useCase.scenarioKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="text-indigo-500">✓</span>
                      <span className="text-gray-700">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t("intercom.security.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("intercom.security.e2e.title")}</h3>
                  <p className="text-indigo-100">{t("intercom.security.e2e.desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  👁️
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("intercom.security.control.title")}</h3>
                  <p className="text-indigo-100">{t("intercom.security.control.desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
                  🛡️
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("intercom.security.protection.title")}</h3>
                  <p className="text-indigo-100">{t("intercom.security.protection.desc")}</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl transform -rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl relative">
                <Image
                  src="/sigla smart home.svg"
                  alt="Security"
                  fill
                  className="p-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
