import { prisma } from "@/lib/prisma";
import SmartComercialContent from "@/components/SmartComercialContent";
import type { ProductWithVariants, ColorVariant } from "@/lib/types";

export default async function SmartComercialPage() {
  const prismaProducts = await prisma.product.findMany({
    include: { colorVariants: true },
    orderBy: { createdAt: "desc" },
  });

  type PrismaProduct = (typeof prismaProducts)[number];

  const products: ProductWithVariants[] = prismaProducts.map((product: PrismaProduct) => {
    const minVariant = product.colorVariants.reduce(
      (min: ColorVariant | null, variant: ColorVariant) =>
        !min || variant.price < min.price ? variant : min,
      product.colorVariants[0]
    );
    return {
      ...product,
      pdfUrl: product.pdfUrl ?? null,
      price: minVariant?.price ?? 0,
      oldPrice: minVariant?.oldPrice ?? null,
      tags: [],
      colorVariants: product.colorVariants.map((v: ColorVariant) => ({
        ...v,
        oldPrice: v.oldPrice ?? null,
      })),
    };
  });

  return <SmartComercialContent products={products} />;
}
