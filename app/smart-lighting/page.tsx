import { prisma } from "@/lib/prisma";
import SmartLightingContent from "@/components/SmartLightingContent";
import type { ProductWithVariants } from "@/lib/types";

export default async function SmartLightingPage() {
  const prismaProducts = await prisma.product.findMany({
    include: { colorVariants: true },
    orderBy: { createdAt: "desc" },
  });

  type PrismaProduct = (typeof prismaProducts)[number];

  const products: ProductWithVariants[] = prismaProducts.map((p: PrismaProduct) => ({
    ...p,
    pdfUrl: p.pdfUrl ?? null,
    colorVariants: p.colorVariants.map((v: (typeof p.colorVariants)[number]) => ({
      ...v,
      oldPrice: v.oldPrice ?? null,
    })),
  }));

  return <SmartLightingContent products={products} />;
}
