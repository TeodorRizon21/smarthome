import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetails from "@/components/ProductDetails";
import RelatedProducts from "@/components/RelatedProducts";
import { ProductWithVariants } from "@/lib/types";

// Dezactivăm caching-ul static pentru această pagină
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProduct(id: string): Promise<ProductWithVariants | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        colorVariants: true,
      },
    });
    return product as ProductWithVariants | null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

async function getOtherProducts(
  currentProductId: string,
  category: string
): Promise<ProductWithVariants[]> {
  try {
    // First, get the count of products in this category (excluding current product)
    const productsCount = await prisma.product.count({
      where: {
        AND: [{ id: { not: currentProductId } }, { category: category }],
      },
    });

    // If we have products, get them in random order
    if (productsCount > 0) {
      // Generate a random skip value to get a random subset
      const skip = Math.floor(Math.random() * productsCount);

      return await prisma.product.findMany({
        where: {
          AND: [{ id: { not: currentProductId } }, { category: category }],
        },
        include: {
          colorVariants: true,
        },
        take: Math.min(12, productsCount), // Luăm maxim 12 produse sau toate dacă sunt mai puține
        skip: skip > productsCount - 12 ? 0 : skip, // Ajustăm skip-ul pentru a ne asigura că avem suficiente produse
        orderBy: {
          id: "asc", // Folosim un orderBy simplu deoarece deja randomizăm prin skip
        },
      });
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch other products:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { color?: string };
}) {
  const product = await getProduct(params.id);
  if (!product) {
    notFound();
  }

  const otherProducts = await getOtherProducts(params.id, product.category);

  return (
    <div className="space-y-16 mb-16">
      <ProductDetails product={product} initialColor={searchParams.color} />
      <RelatedProducts
        products={otherProducts}
        currentProductId={params.id}
        category={product.category}
      />
    </div>
  );
}
