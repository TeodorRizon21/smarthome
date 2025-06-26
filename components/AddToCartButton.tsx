"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ProductWithVariants, ColorVariant } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: ProductWithVariants;
  selectedColor?: string;
  className?: string;
}

export default function AddToCartButton({
  product,
  selectedColor: propSelectedColor,
  className,
}: AddToCartButtonProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    propSelectedColor || ""
  );
  const { dispatch } = useCart();

  useEffect(() => {
    if (propSelectedColor) {
      setSelectedColor(propSelectedColor);
    }
  }, [propSelectedColor]);

  const selectedVariant = product.colorVariants
    ? product.colorVariants.find((v) => v.color === selectedColor)
    : undefined;

  const handleAddToCart = () => {
    const selectedVariant = product.colorVariants.find(
      (v) => v.color === selectedColor
    );
    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a color.",
        variant: "destructive",
      });
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        color: selectedColor,
        variant: selectedVariant,
        quantity: 1,
      },
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedColor}) has been added to your cart.`,
    });
  };

  const button = (
    <Button onClick={handleAddToCart} className={className}>
      <span className="flex items-center justify-center gap-1 w-full">
        <ShoppingCart className="h-4 w-4" />
        <span>Add to Cart</span>
      </span>
    </Button>
  );

  return (
    <div className="flex gap-2">
      {!propSelectedColor && (
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            {product.colorVariants.map((colorVariant) => (
              <SelectItem key={colorVariant.color} value={colorVariant.color}>
                {colorVariant.color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {button}
    </div>
  );
}
