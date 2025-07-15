"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Plus, Trash, Upload, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock?: number;
}

interface BundleItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface BundleItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  discount: number | null;
  items: BundleItemWithProduct[];
}

interface EditBundleFormProps {
  bundle: Bundle;
}

export default function EditBundleForm({
  bundle: initialBundle,
}: EditBundleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<BundleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<string[]>(initialBundle.images);
  const [totalProductsPrice, setTotalProductsPrice] = useState(0);

  const [bundle, setBundle] = useState({
    id: initialBundle.id,
    name: initialBundle.name,
    description: initialBundle.description,
    price: initialBundle.price.toString(),
    oldPrice: initialBundle.oldPrice ? initialBundle.oldPrice.toString() : "",
  });

  useEffect(() => {
    fetchProducts();

    // Transformă BundleItemWithProduct în BundleItem pentru state-ul local
    const initialItems: BundleItem[] = initialBundle.items.map((item) => ({
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
    }));

    setSelectedProducts(initialItems);
  }, []);

  // Calculăm doar suma produselor pentru afișare
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const total = selectedProducts.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotalProductsPrice(total);
    } else {
      setTotalProductsPrice(0);
    }
  }, [selectedProducts]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Eroare",
        description:
          "Nu s-au putut încărca produsele. Încearcă din nou mai târziu.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBundle({
      ...bundle,
      [name]: value,
    });
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (
      product &&
      !selectedProducts.some((item) => item.productId === productId)
    ) {
      setSelectedProducts([
        ...selectedProducts,
        { productId, product, quantity: 1 },
      ]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.productId !== productId)
    );
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const fileArray = Array.from(fileList);
    const newImages: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newImages.push(reader.result as string);
          if (newImages.length === fileArray.length) {
            setImages([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bundle.name.trim() === "") {
      toast({
        title: "Eroare",
        description: "Numele bundle-ului este obligatoriu.",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Eroare",
        description: "Trebuie să adaugi cel puțin un produs în bundle.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Eroare",
        description: "Trebuie să adaugi cel puțin o imagine pentru bundle.",
        variant: "destructive",
      });
      return;
    }

    if (!bundle.price) {
      toast({
        title: "Eroare",
        description: "Trebuie să adaugi un preț pentru bundle.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const bundleData = {
        id: bundle.id,
        name: bundle.name,
        description: bundle.description,
        price: parseFloat(bundle.price),
        oldPrice: bundle.oldPrice ? parseFloat(bundle.oldPrice) : null,
        images,
        items: selectedProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`/api/admin/bundles/${bundle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bundleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bundle");
      }

      toast({
        title: "Succes",
        description: "Bundle-ul a fost actualizat cu succes!",
      });

      router.push("/admin/bundles");
    } catch (error) {
      console.error("Error updating bundle:", error);
      toast({
        title: "Eroare",
        description:
          error instanceof Error
            ? error.message
            : "Nu s-a putut actualiza bundle-ul.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informații Bundle */}
        <Card>
          <CardHeader>
            <CardTitle>Informații Bundle</CardTitle>
            <CardDescription>
              Actualizează detaliile generale despre bundle-ul de produse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume Bundle</Label>
              <Input
                id="name"
                name="name"
                value={bundle.name}
                onChange={handleInputChange}
                placeholder="ex. Smart Home Starter Kit"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                name="description"
                value={bundle.description}
                onChange={handleInputChange}
                placeholder="Descriere detaliată a bundle-ului..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="price" className="mr-2">
                    Preț (RON)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Introduceți manual prețul bundle-ului
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  value={bundle.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPrice">Preț Vechi (RON)</Label>
                <Input
                  id="oldPrice"
                  name="oldPrice"
                  type="text"
                  inputMode="decimal"
                  value={bundle.oldPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Câmp informativ pentru suma produselor */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Suma prețurilor produselor:
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-gray-400 ml-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Această valoare este doar informativă și nu va fi
                          salvată
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-semibold">
                  {totalProductsPrice.toFixed(2)} RON
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagini */}
        <Card>
          <CardHeader>
            <CardTitle>Imagini Bundle</CardTitle>
            <CardDescription>
              Actualizează imaginile pentru bundle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square border rounded-md overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Imagine bundle ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Încarcă imagini</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produse în Bundle */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Produse în Bundle</CardTitle>
          <CardDescription>
            Actualizează produsele care fac parte din acest bundle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Căutare produse */}
          <div>
            <Input
              placeholder="Caută produse după nume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </div>

          {/* Grila de produse disponibile */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Produse disponibile
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              {products
                .filter(
                  (product) =>
                    product.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) &&
                    !selectedProducts.some(
                      (item) => item.productId === product.id
                    )
                )
                .slice(0, 12)
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="relative aspect-square"
                      style={{ height: "100px" }}
                    >
                      <img
                        src={product.images[0] || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="font-medium text-xs truncate leading-tight">
                        {product.name}
                      </h4>
                      <div className="text-xs font-semibold text-primary mt-1">
                        {product.price.toFixed(2)} RON
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7 mt-1.5 rounded-md border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        onClick={() => handleAddProduct(product.id)}
                      >
                        Adaugă în Bundle
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Lista de produse selectate */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Produse selectate pentru bundle
            </Label>
            {selectedProducts.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preț
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantitate
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProducts.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                item.product.images[0] ||
                                "/placeholder-image.jpg"
                              }
                              alt={item.product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.product.price.toFixed(2)} RON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(item.productId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  Nu ai adăugat încă niciun produs în bundle. Selectează produse
                  din lista de mai sus.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Actualizează Bundle"
          )}
        </Button>
      </div>
    </form>
  );
}
