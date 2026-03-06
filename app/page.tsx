import SmartHomeHero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import { prisma } from "@/lib/prisma";
import BundleShowcase from "@/components/BundleShowcase";
import InstallationShowcase from "@/components/InstallationShowcase";
import type { ProductWithVariants, ColorVariant } from "@/lib/types";

// Facem pagina home statică cu revalidare periodică pentru a reduce consumul de CPU
export const revalidate = 600; // 10 minute

async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        colorVariants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    });

    return products.map((product) => {
      const minVariant = product.colorVariants.reduce(
        (min: ColorVariant | null, variant: ColorVariant) =>
          !min || variant.price < min.price ? variant : min,
        product.colorVariants[0]
      );

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: minVariant?.price ?? 0,
        oldPrice: minVariant?.oldPrice ?? null,
        sizes: product.colorVariants.map((v: ColorVariant) => v.color),
        pdfUrl: product.pdfUrl,
        tags: [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        colorVariants: product.colorVariants,
      };
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getBundles() {
  try {
    if (!prisma.bundle) {
      console.error("Bundle model not found in Prisma client");
      return [];
    }

    return await prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        BundleOrder: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return [];
  }
}

const residentialInstallations = [
  {
    title: "Apartament",
    description:
      "Automatizare completă pentru un apartament modern, cu accent pe confort și eficiență.",
    image: "/img1.jpg",
    features: [
      "Control încălzire în pardoseală",
      "Control lumini (on/off, dimming, senzori pentru aprindere automată)",
      "Control AC",
      "Redare audio 4 zone",
      "Control rulouri",
      "Control draperii",
      "Control și vizualizare pe telefon",
      "Interfon",
      "Scenarii",
    ],
  },
  {
    title: "Casă de vacanță din lemn",
    description:
      "Soluție smart pentru o casă de vacanță, gândită pentru siguranță și control de la distanță.",
    image: "/img11.jpg",
    features: [
      "Control încălzire",
      "Control lumini (on/off, dimming, senzori pentru aprindere automată)",
      "Control rulouri",
      "Scenarii",
      "Interfon și control acces",
      "Control și vizualizare pe telefon",
    ],
  },
  {
    title: "Vilă",
    description:
      "Automatizare avansată pentru vilă, cu integrare completă a tuturor sistemelor tehnice.",
    image: "/smart-residence.jpg",
    features: [
      "Control încălzire în pardoseală",
      "Control lumini (on/off, dimming, senzori pentru aprindere automată)",
      "Control ventiloconvectoare",
      "Redare audio 6 zone",
      "Control rulouri",
      "Integrare cu pompă de căldură și panouri solare",
      "Sistem de alarmă integrat",
      "Vizualizare camere CCTV",
      "Stație meteo",
      "Interfon și control acces",
      "Control și vizualizare pe telefon",
    ],
  },
];

const commercialInstallations = [
  {
    title: "Clădire de Birouri Floreasca",
    description:
      "Sistem complex de automatizare pentru o clădire de birouri cu 6 etaje, incluzând control acces și management energetic.",
    image: "/smart-comercial.jpg",
    stats: [
      { label: "Economie Energie", value: "45%" },
      { label: "Suprafață", value: "2500m²" },
      { label: "Dispozitive", value: "120+" },
      { label: "ROI", value: "2 ani" },
    ],
  },
  {
    title: "Hotel Boutique Centru",
    description:
      "Soluție completă de automatizare hotelieră cu control individual pentru 28 de camere.",
    image: "/smart-hotel.jpg",
    stats: [
      { label: "Economie Energie", value: "38%" },
      { label: "Camere", value: "28" },
      { label: "Dispozitive", value: "150+" },
      { label: "Satisfacție", value: "98%" },
    ],
  },
  {
    title: "Restaurant Smart Decebal",
    description:
      "Sistem integrat de control pentru iluminat, HVAC și ambianță, cu focus pe experiența clientului.",
    image: "/office-case.jpg",
    stats: [
      { label: "Economie Energie", value: "32%" },
      { label: "Zone Control", value: "6" },
      { label: "Dispozitive", value: "40+" },
      { label: "ROI", value: "18 luni" },
    ],
  },
];

export default async function Home() {
  const [bundles, products] = await Promise.all([getBundles(), getProducts()]);

  return (
    <main className="min-h-screen">
      <SmartHomeHero />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1250px] mx-auto w-full px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Produse Recomandate
          </h2>
          <ProductCarousel products={products} />
        </div>
      </section>

      {/* Smart Residential Showcase */}
      <InstallationShowcase
        title="Proiecte Rezidențiale"
        subtitle="Descoperă cum am transformat case obișnuite în locuințe inteligente și eficiente"
        installations={residentialInstallations}
      />

      {/* Bundles Section */}
      {bundles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1250px] mx-auto w-full px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pachete Smart Home
            </h2>
            <BundleShowcase bundles={bundles as any} />
          </div>
        </section>
      )}

      {/* Smart Commercial Showcase */}
      <InstallationShowcase
        title="Proiecte Comerciale"
        subtitle="Vezi cum am implementat soluții smart în spații comerciale pentru eficiență maximă"
        installations={commercialInstallations}
      />

      {/* Newsletter Section */}
      <section className="pt-16 bg-white">
        <div className="container mx-auto">
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
