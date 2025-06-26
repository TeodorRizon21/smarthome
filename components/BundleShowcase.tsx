"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package } from "lucide-react";
import { Bundle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface BundleShowcaseProps {
  bundles: Bundle[];
}

export default function BundleShowcase({ bundles }: BundleShowcaseProps) {
  if (!bundles || bundles.length === 0) {
    return null;
  }

  const handleAddToCart = (bundle: Bundle) => {
    // TODO: Implement add to cart functionality for bundles
    console.log("Add bundle to cart:", bundle);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bundles.map((bundle) => {
        const isOnSale = bundle.oldPrice && bundle.oldPrice > bundle.price;

        return (
          <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-100">
              {bundle.images[0] && (
                <Image
                  src={bundle.images[0]}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
              )}
              {isOnSale && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
              <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                <Package className="w-3 h-3 mr-1" />
                Bundle
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{bundle.name}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">
                {bundle.description}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {bundle.price.toFixed(2)} lei
                  </span>
                  {isOnSale && (
                    <span className="text-lg text-gray-500 line-through">
                      {bundle.oldPrice?.toFixed(2)} lei
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bundle.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      {item.product.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(bundle)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/bundles/${bundle.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
