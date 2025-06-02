"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { SizeVariant } from "@/lib/types";

interface BundleItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  discount: number | null;
  items: BundleItem[];
  stock: number;
  allowOutOfStock: boolean;
}

interface BundleShowcaseProps {
  bundles: Bundle[];
}

export default function BundleShowcase({ bundles }: BundleShowcaseProps) {
  const { dispatch } = useCart();

  if (!bundles || bundles.length === 0) {
    return null;
  }

  const handleAddToCart = (bundle: Bundle, e: React.MouseEvent) => {
    e.preventDefault();

    console.log("Bundle complet adăugat în coș:", JSON.stringify(bundle));

    // Create a dummy size variant for the bundle
    const bundleVariant: SizeVariant = {
      id: bundle.id,
      productId: `bundle-${bundle.id}`,
      size: "standard",
      price: bundle.price,
      oldPrice: bundle.oldPrice,
      stock: bundle.stock,
      lowStockThreshold: 5,
    };

    // Add to cart using dispatch
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          id: `bundle-${bundle.id}`,
          name: `[Pachet] ${bundle.name}`,
          description: bundle.description,
          images: bundle.images,
          sizeVariants: [bundleVariant],
          allowOutOfStock: bundle.allowOutOfStock,
          showStockLevel: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        size: "standard",
        variant: bundleVariant,
        quantity: 1,
      },
    });

    // Show success toast
    toast({
      title: "Pachet adăugat în coș",
      description: `${bundle.name} a fost adăugat în coșul tău.`,
      action: (
        <ToastAction altText="Vezi coșul" asChild>
          <Link
            href="/cart"
            className="bg-[#FFD66C] hover:bg-[#ffc936] text-black transition-colors"
          >
            Vezi coșul
          </Link>
        </ToastAction>
      ),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bundles.map((bundle) => (
        <Card
          key={bundle.id}
          className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          <Link href={`/bundles/${bundle.id}`}>
            <div className="aspect-video relative">
              <img
                src={bundle.images[0] || "/placeholder-image.jpg"}
                alt={bundle.name}
                className="w-full h-full object-cover"
              />
              {bundle.oldPrice && bundle.oldPrice > bundle.price && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 m-2 text-xs font-medium">
                  -
                  {Math.round(
                    ((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100
                  )}
                  %
                </div>
              )}
            </div>
          </Link>

          <CardContent className="p-4">
            <Link href={`/bundles/${bundle.id}`}>
              <h3 className="font-semibold text-lg mb-1 hover:text-primary">
                {bundle.name}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {bundle.description}
            </p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-lg font-bold text-primary">
                {bundle.price.toFixed(2)} RON
              </span>
              {bundle.oldPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {bundle.oldPrice.toFixed(2)} RON
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {bundle.items.length} produse incluse
              </div>
              <Button
                size="sm"
                className="h-8"
                onClick={(e) => handleAddToCart(bundle, e)}
                disabled={bundle.stock === 0 && !bundle.allowOutOfStock}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Adaugă în coș
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
