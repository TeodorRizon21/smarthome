import { prisma } from "@/lib/prisma";
import HomePageContent from "@/components/HomePageContent";
import type { ProductWithVariants, ColorVariant } from "@/lib/types";
import type { Prisma } from "@prisma/client";

// Tip pentru rezultatul query-ului (include colorVariants; featured e în where)
type ProductWithColorVariants = {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string | null;
  subcategory: string | null;
  pdfUrl: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  colorVariants: ColorVariant[];
};

// Facem pagina home statică cu revalidare periodică pentru a reduce consumul de CPU
export const revalidate = 600; // 10 minute

async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        images: { isEmpty: false },
      } as Prisma.ProductWhereInput,
      include: {
        colorVariants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    }) as unknown as ProductWithColorVariants[];

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

export default async function Home() {
  const [bundles, products] = await Promise.all([getBundles(), getProducts()]);

  return (
    <HomePageContent
      products={products}
      bundles={(bundles as import("@/lib/types").Bundle[]) ?? []}
    />
  );
}
