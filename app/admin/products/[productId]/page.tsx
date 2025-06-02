import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export default async function ViewProductPage({
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
    include: { sizeVariants: true },
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la Produse
          </Button>
        </Link>
        <Link href={`/admin/products/edit/${product.id}`}>
          <Button className="flex items-center">
            <Edit2 className="mr-2 h-4 w-4" />
            Editează Produs
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Nu există imagine</p>
              </div>
            )}

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">ID: {product.id}</p>
              <p className="text-sm text-gray-500">
                Creat la:{" "}
                {format(new Date(product.createdAt), "dd.MM.yyyy HH:mm")}
              </p>
              <p className="text-sm text-gray-500">
                Ultima actualizare:{" "}
                {format(new Date(product.updatedAt), "dd.MM.yyyy HH:mm")}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Descriere</h2>
              <p className="mt-2 text-gray-700">{product.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Variante</h2>
              <div className="mt-2 space-y-2">
                {product.sizeVariants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{variant.size}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({variant.stock} în stoc)
                      </span>
                    </div>
                    <div className="font-medium">
                      {variant.oldPrice && (
                        <span className="line-through text-gray-500 mr-2">
                          {variant.oldPrice.toFixed(2)} RON
                        </span>
                      )}
                      <span>{variant.price.toFixed(2)} RON</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.collections.map((collection, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {collection}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Stoc Total</p>
                <p className="font-medium">{product.stock}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Prag Stoc Scăzut</p>
                <p className="font-medium">
                  {product.lowStockThreshold || "Nesetat"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Afișează Nivelul Stocului</p>
                <p className="font-medium">
                  {product.showStockLevel ? "Da" : "Nu"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Permite Fără Stoc</p>
                <p className="font-medium">
                  {product.allowOutOfStock ? "Da" : "Nu"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">PDF Instrucțiuni</p>
                <p className="font-medium">
                  {product.pdfUrl ? (
                    <a
                      href={product.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Vizualizează PDF
                    </a>
                  ) : (
                    "Nu există"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
