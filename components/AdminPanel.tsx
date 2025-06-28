"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import type { Product } from "@/lib/types";
import { CATEGORIES, VDP_SUBCATEGORIES } from "@/lib/categories";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PDFUpload from "@/components/PDFUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorVariant {
  id?: string;
  productCode: string;
  color: string;
  price: string;
  oldPrice: string;
}

type AdminPanelProps = {
  product?: Product & {
    colorVariants: Array<{
      id: string;
      productCode: string;
      color: string;
      price: number;
      oldPrice: number | null;
    }>;
  };
};

export default function AdminPanel({ product }: AdminPanelProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [pdfUrl, setPdfUrl] = useState<string | null>(product?.pdfUrl || null);
  const [category, setCategory] = useState<string>(
    product?.category || CATEGORIES.VIDEO_DOOR_PHONE
  );
  const [subcategory, setSubcategory] = useState<string>(
    product?.subcategory || ""
  );
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    product?.colorVariants.map(
      (variant: {
        id: string;
        productCode: string;
        color: string;
        price: number;
        oldPrice: number | null;
      }) => ({
        id: variant.id,
        productCode: variant.productCode,
        color: variant.color,
        price: variant.price.toString(),
        oldPrice: variant.oldPrice?.toString() || "",
      })
    ) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addColorVariant = () => {
    setColorVariants([
      ...colorVariants,
      {
        productCode: "",
        color: "",
        price: "",
        oldPrice: "",
      },
    ]);
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const updateColorVariant = (
    index: number,
    field: keyof ColorVariant,
    value: string
  ) => {
    const newVariants = [...colorVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setColorVariants(newVariants);

    // Auto-add to SALE category if any variant has an old price
    const hasOldPrice = newVariants.some(
      (variant) =>
        variant.oldPrice &&
        parseFloat(variant.oldPrice) > parseFloat(variant.price)
    );
    if (hasOldPrice && category !== CATEGORIES.SALE) {
      setCategory(CATEGORIES.SALE);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (colorVariants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one color variant",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate category and subcategory
    if (category === CATEGORIES.VIDEO_DOOR_PHONE && !subcategory) {
      toast({
        title: "Error",
        description: "Please select a subcategory for Video Door Phone",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate color variants
    for (const variant of colorVariants) {
      if (!variant.productCode || !variant.color || !variant.price) {
        toast({
          title: "Error",
          description:
            "All color variants must have a product code, color, and price",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (
        variant.oldPrice &&
        parseFloat(variant.oldPrice) <= parseFloat(variant.price)
      ) {
        toast({
          title: "Error",
          description: "Old price must be greater than current price",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            images,
            category,
            subcategory:
              category === CATEGORIES.VIDEO_DOOR_PHONE ? subcategory : null,
            pdfUrl,
            colorVariants: colorVariants.map((variant) => ({
              id: variant.id,
              productCode: variant.productCode,
              color: variant.color,
              price: parseFloat(variant.price),
              oldPrice: variant.oldPrice ? parseFloat(variant.oldPrice) : null,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      toast({
        title: "Success",
        description: product
          ? "Product updated successfully"
          : "Product added successfully",
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add/update product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CATEGORIES).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category === CATEGORIES.VIDEO_DOOR_PHONE && (
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select value={subcategory} onValueChange={setSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VDP_SUBCATEGORIES).map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Product Images (up to 10)</Label>
        <ImageUpload
          value={images}
          onChange={(urls) => setImages(urls)}
          maxFiles={10}
        />
      </div>

      <div>
        <Label>Manual PDF (optional)</Label>
        <PDFUpload value={pdfUrl} onChange={setPdfUrl} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Color Variants</Label>
          <Button type="button" onClick={addColorVariant}>
            Add Color Variant
          </Button>
        </div>

        <div className="space-y-4">
          {colorVariants.map((variant, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Code</Label>
                    <Input
                      value={variant.productCode}
                      onChange={(e) =>
                        updateColorVariant(index, "productCode", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        updateColorVariant(index, "color", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        updateColorVariant(index, "price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Old Price (optional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.oldPrice}
                      onChange={(e) =>
                        updateColorVariant(index, "oldPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeColorVariant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? product
            ? "Updating..."
            : "Adding..."
          : product
          ? "Update Product"
          : "Add Product"}
      </Button>
    </form>
  );
}
