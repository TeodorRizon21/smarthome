import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/EditProductForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { colorVariants: true },
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/admin/products">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Produse
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Editează Produs</h1>
      <EditProductForm product={product} />
    </div>
  );
}
