"use client";

import SmartHomeHero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import BundleShowcase from "@/components/BundleShowcase";
import InstallationShowcase from "@/components/InstallationShowcase";
import { useLanguage } from "@/contexts/language-context";
import type { ProductWithVariants } from "@/lib/types";
import type { Bundle } from "@/lib/types";

type TranslationKey = import("@/contexts/language-context").TranslationKey;

// Structură pentru instalări rezidențiale (chei de traducere)
const residentialConfig = [
  {
    image: "/img1.jpg",
    titleKey: "home.inst.res0.title" as TranslationKey,
    descKey: "home.inst.res0.desc" as TranslationKey,
    featureKeys: [
      "home.inst.res0.f1",
      "home.inst.res0.f2",
      "home.inst.res0.f3",
      "home.inst.res0.f4",
      "home.inst.res0.f5",
      "home.inst.res0.f6",
      "home.inst.res0.f7",
      "home.inst.res0.f8",
      "home.inst.res0.f9",
    ] as TranslationKey[],
  },
  {
    image: "/img11.jpg",
    titleKey: "home.inst.res1.title" as TranslationKey,
    descKey: "home.inst.res1.desc" as TranslationKey,
    featureKeys: [
      "home.inst.res1.f1",
      "home.inst.res1.f2",
      "home.inst.res1.f3",
      "home.inst.res1.f4",
      "home.inst.res1.f5",
      "home.inst.res1.f6",
    ] as TranslationKey[],
  },
  {
    image: "/smart-residence.jpg",
    titleKey: "home.inst.res2.title" as TranslationKey,
    descKey: "home.inst.res2.desc" as TranslationKey,
    featureKeys: [
      "home.inst.res2.f1",
      "home.inst.res2.f2",
      "home.inst.res2.f3",
      "home.inst.res2.f4",
      "home.inst.res2.f5",
      "home.inst.res2.f6",
      "home.inst.res2.f7",
      "home.inst.res2.f8",
      "home.inst.res2.f9",
      "home.inst.res2.f10",
      "home.inst.res2.f11",
    ] as TranslationKey[],
  },
];

// Structură pentru instalări comerciale (chei + valori numerice fixe)
const commercialConfig = [
  {
    image: "/smart-comercial.jpg",
    titleKey: "home.inst.comm0.title" as TranslationKey,
    descKey: "home.inst.comm0.desc" as TranslationKey,
    stats: [
      { labelKey: "home.inst.comm0.s1" as TranslationKey, value: "45%" },
      { labelKey: "home.inst.comm0.s2" as TranslationKey, value: "2500m²" },
      { labelKey: "home.inst.comm0.s3" as TranslationKey, value: "120+" },
      { labelKey: "home.inst.comm0.s4" as TranslationKey, valueKey: "home.inst.comm0.s4value" as TranslationKey },
    ],
  },
  {
    image: "/smart-hotel.jpg",
    titleKey: "home.inst.comm1.title" as TranslationKey,
    descKey: "home.inst.comm1.desc" as TranslationKey,
    stats: [
      { labelKey: "home.inst.comm1.s1" as TranslationKey, value: "38%" },
      { labelKey: "home.inst.comm1.s2" as TranslationKey, value: "28" },
      { labelKey: "home.inst.comm1.s3" as TranslationKey, value: "150+" },
      { labelKey: "home.inst.comm1.s4" as TranslationKey, value: "98%" },
    ],
  },
  {
    image: "/office-case.jpg",
    titleKey: "home.inst.comm2.title" as TranslationKey,
    descKey: "home.inst.comm2.desc" as TranslationKey,
    stats: [
      { labelKey: "home.inst.comm2.s1" as TranslationKey, value: "32%" },
      { labelKey: "home.inst.comm2.s2" as TranslationKey, value: "6" },
      { labelKey: "home.inst.comm2.s3" as TranslationKey, value: "40+" },
      { labelKey: "home.inst.comm2.s4" as TranslationKey, valueKey: "home.inst.comm2.s4value" as TranslationKey },
    ],
  },
];

interface HomePageContentProps {
  products: ProductWithVariants[];
  bundles: Bundle[];
}

export default function HomePageContent({ products, bundles }: HomePageContentProps) {
  const { t } = useLanguage();

  const residentialInstallations = residentialConfig.map((item) => ({
    title: t(item.titleKey),
    description: t(item.descKey),
    image: item.image,
    features: item.featureKeys.map((key) => t(key)),
  }));

  const commercialInstallations = commercialConfig.map((item) => ({
    title: t(item.titleKey),
    description: t(item.descKey),
    image: item.image,
    stats: item.stats.map((s) => ({
      label: t(s.labelKey),
      value: "valueKey" in s && s.valueKey ? t(s.valueKey) : (s as { value: string }).value,
    })),
  }));

  return (
    <main className="min-h-screen">
      <SmartHomeHero />

      <section className="py-16 bg-white">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.featuredTitle")}
          </h2>
          <ProductCarousel products={products} />
        </div>
      </section>

      <InstallationShowcase
        title={t("home.residentialTitle")}
        subtitle={t("home.residentialSubtitle")}
        installations={residentialInstallations}
      />

      {bundles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1250px] mx-auto w-full px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("home.bundlesTitle")}
            </h2>
            <BundleShowcase bundles={bundles} />
          </div>
        </section>
      )}

      <InstallationShowcase
        title={t("home.commercialTitle")}
        subtitle={t("home.commercialSubtitle")}
        installations={commercialInstallations}
      />

      <section className="pt-16 bg-white">
        <div className="container mx-auto">
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
