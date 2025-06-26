import SmartHomeHero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import { prisma } from "@/lib/prisma";
import BundleShowcase from "@/components/BundleShowcase";
import InstallationShowcase from "@/components/InstallationShowcase";
import type { ProductWithVariants, Product, ColorVariant } from "@/lib/types";

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
      // Calculate aggregate values from colorVariants
      const minVariant = product.colorVariants.reduce((min: ColorVariant | null, variant: ColorVariant) => 
        (!min || variant.price < min.price) ? variant : min
      , product.colorVariants[0]);

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
    title: "Vila Smart Pipera",
    description: "Sistem complet de automatizare pentru o vilă de lux din Pipera, incluzând control lumini, temperatură, securitate și entertainment.",
    image: "/smart-residence.jpg",
    stats: [
      { label: "Economie Energie", value: "35%" },
      { label: "Camere Control", value: "12" },
      { label: "Dispozitive", value: "45+" },
      { label: "Timp Instalare", value: "14 zile" }
    ]
  },
  {
    title: "Apartament Premium Aviației",
    description: "Soluție inteligentă pentru un apartament modern, cu focus pe eficiență energetică și confort.",
    image: "/img1.jpg",
    stats: [
      { label: "Economie Energie", value: "28%" },
      { label: "Camere Control", value: "6" },
      { label: "Dispozitive", value: "25+" },
      { label: "Timp Instalare", value: "7 zile" }
    ]
  },
  {
    title: "Casa Inteligentă Corbeanca",
    description: "Sistem integrat de smart home cu accent pe securitate și automatizare completă.",
    image: "/img11.jpg",
    stats: [
      { label: "Economie Energie", value: "40%" },
      { label: "Camere Control", value: "8" },
      { label: "Dispozitive", value: "35+" },
      { label: "Timp Instalare", value: "10 zile" }
    ]
  }
];

const commercialInstallations = [
  {
    title: "Clădire de Birouri Floreasca",
    description: "Sistem complex de automatizare pentru o clădire de birouri cu 6 etaje, incluzând control acces și management energetic.",
    image: "/smart-comercial.jpg",
    stats: [
      { label: "Economie Energie", value: "45%" },
      { label: "Suprafață", value: "2500m²" },
      { label: "Dispozitive", value: "120+" },
      { label: "ROI", value: "2 ani" }
    ]
  },
  {
    title: "Hotel Boutique Centru",
    description: "Soluție completă de automatizare hotelieră cu control individual pentru 28 de camere.",
    image: "/smart-hotel.jpg",
    stats: [
      { label: "Economie Energie", value: "38%" },
      { label: "Camere", value: "28" },
      { label: "Dispozitive", value: "150+" },
      { label: "Satisfacție", value: "98%" }
    ]
  },
  {
    title: "Restaurant Smart Decebal",
    description: "Sistem integrat de control pentru iluminat, HVAC și ambianță, cu focus pe experiența clientului.",
    image: "/office-case.jpg",
    stats: [
      { label: "Economie Energie", value: "32%" },
      { label: "Zone Control", value: "6" },
      { label: "Dispozitive", value: "40+" },
      { label: "ROI", value: "18 luni" }
    ]
  }
];

export default async function Home() {
  const [bundles, products] = await Promise.all([
    getBundles(),
    getProducts()
  ]);

  return (
    <main className="min-h-screen">
      <SmartHomeHero />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
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
          <div className="container mx-auto px-4">
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
