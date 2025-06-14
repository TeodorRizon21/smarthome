import SmartHomeHero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Newsletter from "@/components/Newsletter";
import { prisma } from "@/lib/prisma";
import BundleShowcase from "@/components/BundleShowcase";
import InstallationShowcase from "@/components/InstallationShowcase";
import type { ProductWithVariants, Product, SizeVariant } from "@/lib/types";

async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        sizeVariants: true,
      },
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products.map((product: { 
      id: string;
      name: string;
      description: string;
      images: string[];
      collections: string[];
      allowOutOfStock: boolean;
      showStockLevel: boolean;
      pdfUrl: string | null;
      createdAt: Date;
      updatedAt: Date;
      sizeVariants: SizeVariant[];
    }) => {
      // Calculate aggregate values from sizeVariants
      const minVariant = product.sizeVariants.reduce((min: SizeVariant | null, variant: SizeVariant) => 
        (!min || variant.price < min.price) ? variant : min
      , product.sizeVariants[0]);

      const totalStock = product.sizeVariants.reduce((sum: number, variant: SizeVariant) => 
        sum + variant.stock
      , 0);

      const minLowStockThreshold = product.sizeVariants.reduce((min: number | null, variant: SizeVariant) => {
        const threshold = variant.lowStockThreshold ?? null;
        if (threshold === null) return min;
        if (min === null) return threshold;
        return threshold < min ? threshold : min;
      }, null);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        collections: product.collections,
        price: minVariant?.price ?? 0,
        oldPrice: minVariant?.oldPrice ?? null,
        sizes: product.sizeVariants.map((v: SizeVariant) => v.size),
        stock: totalStock,
        lowStockThreshold: minLowStockThreshold,
        allowOutOfStock: product.allowOutOfStock,
        showStockLevel: product.showStockLevel,
        pdfUrl: product.pdfUrl,
        tags: [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        sizeVariants: product.sizeVariants,
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
    image: "/images/smart-home-1.jpg",
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
    image: "/images/smart-home-2.jpg",
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
    image: "/images/smart-home-3.jpg",
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
    image: "/images/smart-commercial-1.jpg",
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
    image: "/images/smart-commercial-2.jpg",
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
    image: "/images/smart-commercial-3.jpg",
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
            <BundleShowcase bundles={bundles} />
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
