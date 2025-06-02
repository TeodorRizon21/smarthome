"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithVariants, SizeVariant } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  const { dispatch } = useCart();
  const getInitialVariant = () => {
    if (!product.sizeVariants || product.sizeVariants.length === 0) return null;
    const inStockVariants = product.sizeVariants.filter(
      (v) => v.stock > 0 || product.allowOutOfStock
    );
    return inStockVariants[0] || product.sizeVariants[0];
  };

  const [selectedVariant, setSelectedVariant] = useState<SizeVariant | null>(
    getInitialVariant()
  );

  const isOutOfStock =
    !selectedVariant ||
    (selectedVariant.stock === 0 && !product.allowOutOfStock);

  const isBestSeller = product.tags?.includes("bestseller");
  const isOnSale =
    selectedVariant?.oldPrice &&
    selectedVariant.oldPrice > selectedVariant.price;

  const productUrl = `/products/${product.id}${
    selectedVariant ? `?size=${selectedVariant.size}` : ""
  }`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedVariant) {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          product,
          size: selectedVariant.size,
          variant: selectedVariant,
          quantity: 1,
        },
      });

      toast({
        title: "Produs adăugat în coș",
        description: `${product.name} (${selectedVariant.size}) a fost adăugat în coșul tău.`,
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
    }
  };

  return (
    <Link href={productUrl} className="block h-full">
      <div className="relative w-[250px] h-[400px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-[#FFD66C] text-black px-3 py-0.5 rounded-full text-xs font-medium">
              BestSeller
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-[250px] w-full bg-[#1a1a1a] overflow-hidden flex-shrink-0">
          <Image
            src={product.images[0] || `/api/placeholder?width=250&height=250`}
            alt={product.name}
            fill
            sizes="250px"
            className="object-cover transition-opacity duration-300"
          />
          {/* Description Overlay */}
          <div className="absolute inset-0 p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" />
            <p className="text-white text-center text-xs leading-relaxed relative z-10">
              {product.description || "Fără descriere disponibilă"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 truncate">{product.name}</h3>

          {/* Size Variants */}
          <div className="flex flex-wrap gap-1.5 mb-auto">
            {product.sizeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(variant);
                }}
                disabled={variant.stock === 0 && !product.allowOutOfStock}
                className={`px-2 py-0.5 text-xs rounded-full border transition-colors duration-200 ${
                  selectedVariant?.id === variant.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
                } ${
                  variant.stock === 0 && !product.allowOutOfStock
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {variant.size}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-1">
              <p
                className={`text-xl font-bold ${
                  isOnSale ? "text-red-600" : ""
                }`}
              >
                {selectedVariant?.price.toFixed(2)} lei
              </p>
              {isOnSale && (
                <p className="text-xs text-gray-500 line-through">
                  {selectedVariant?.oldPrice?.toFixed(2)} lei
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-[#FFD66C] p-3 rounded-xl hover:bg-[#ffc936] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
