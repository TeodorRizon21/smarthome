import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit2, ArrowLeft, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ViewBundlePageProps {
  params: {
    id: string;
  };
}

interface BundleItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
  };
}

export default async function ViewBundlePage({ params }: ViewBundlePageProps) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  const bundleId = params.id;

  // Obținem datele bundle-ului pentru a le afișa
  const bundle = await prisma.bundle.findUnique({
    where: {
      id: bundleId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!bundle) {
    redirect("/admin/bundles");
  }

  // Calculăm totalul prețurilor produselor
  const totalProductsPrice = bundle.items.reduce(
    (total: number, item: BundleItem) => total + item.product.price * item.quantity,
    0
  );

  // Calculăm reducerea în procent dacă avem și preț vechi
  const discountPercentage = bundle.oldPrice
    ? Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100)
    : bundle.discount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bundles">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{bundle.name}</h1>
          </div>
          <p className="text-gray-500 mt-1">Detaliile bundle-ului</p>
        </div>

        <Link href={`/admin/bundles/edit/${bundle.id}`}>
          <Button className="gap-1">
            <Edit2 className="h-4 w-4" />
            Editează Bundle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagine și Detalii */}
        <div className="lg:col-span-2 space-y-6">
          {/* Imagini */}
          <Card>
            <CardHeader>
              <CardTitle>Imagini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bundle.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square border rounded-md overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Imagine bundle ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Descriere */}
          <Card>
            <CardHeader>
              <CardTitle>Descriere</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {bundle.description}
              </p>
            </CardContent>
          </Card>

          {/* Produse Incluse */}
          <Card>
            <CardHeader>
              <CardTitle>Produse Incluse</CardTitle>
              <CardDescription>
                Lista produselor incluse în acest bundle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {bundle.items.map((item: BundleItem) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col md:flex-row items-start md:items-center gap-4"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.product.images[0] || "/placeholder-image.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.product.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm text-gray-500">
                        Cantitate: {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informații Generale */}
          <Card>
            <CardHeader>
              <CardTitle>Informații</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-500">ID Bundle</dt>
                  <dd className="font-medium">{bundle.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Creat La</dt>
                  <dd className="font-medium">
                    {new Date(bundle.createdAt).toLocaleDateString("ro-RO")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Actualizat La</dt>
                  <dd className="font-medium">
                    {new Date(bundle.updatedAt).toLocaleDateString("ro-RO")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Număr Produse</dt>
                  <dd className="font-medium">{bundle.items.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Preț și Stoc */}
          <Card>
            <CardHeader>
              <CardTitle>Preț și Stoc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Preț Bundle</span>
                    <div className="text-right">
                      <span className="text-xl font-bold">
                        ${bundle.price.toFixed(2)}
                      </span>
                      {bundle.oldPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through">
                            ${bundle.oldPrice.toFixed(2)}
                          </span>
                          <Badge className={cn(
                            "bg-green-100 text-green-700"
                          )}>
                            {discountPercentage}% reducere
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-500">Preț Total Produse</span>
                  <span className="font-medium">
                    ${totalProductsPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-500">Economie</span>
                  <div className="text-right">
                    <span className="font-medium text-green-600">
                      ${(totalProductsPrice - bundle.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-500">Stoc</span>
                  <div>
                    <span className="font-medium">
                      {bundle.stock} disponibile
                    </span>
                    <div className="mt-1">
                      {bundle.stock === 0 && !bundle.allowOutOfStock ? (
                        <Badge
                          className={cn(
                            "bg-red-100 text-red-700"
                          )}
                        >
                          Stoc Epuizat
                        </Badge>
                      ) : bundle.stock <= 5 ? (
                        <Badge
                          className={cn(
                            "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          Stoc Limitat
                        </Badge>
                      ) : (
                        <Badge
                          className={cn(
                            "bg-green-100 text-green-700"
                          )}
                        >
                          În Stoc
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-500">
                    Permite Vânzare Fără Stoc
                  </span>
                  <Badge
                    className={cn(
                      bundle.allowOutOfStock
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {bundle.allowOutOfStock ? "Da" : "Nu"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
