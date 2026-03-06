"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft } from "lucide-react";

interface ColorVariant {
  id: string;
  productCode: string;
  color: string;
  price: number;
  oldPrice: number | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string | null;
  subcategory: string | null;
  featured?: boolean;
  colorVariants: ColorVariant[];
}

export default function AdminRecommendedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const [statusRes, productsRes] = await Promise.all([
        fetch("/api/admin/check-status"),
        fetch("/api/admin/products"),
      ]);
      const statusData = await statusRes.json();
      if (!statusData.isAdmin) {
        redirect("/");
        return;
      }
      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const data = await productsRes.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca produsele.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (product: Product, checked: boolean) => {
    setUpdatingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: checked }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, featured: checked } : p
        )
      );
      toast({
        title: checked ? "Adăugat la recomandate" : "Scos de la recomandate",
        description: product.name,
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza produsul.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Produse recomandate
          </h1>
          <p className="text-gray-500">
            Bifează produsele care apar în secțiunea „Produse recomandate” pe
            pagina principală. Momentan {featuredCount} produs(e) recomandat(e).
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px]">Imagine</TableHead>
              <TableHead className="min-w-[280px]">Produs</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead className="w-[180px] text-center">
                Afișat la recomandate
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Fără imagine</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {(!product.images || product.images.length === 0) && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Nu apare pe home (fără imagine)
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">
                    {product.category || "—"}
                    {product.subcategory && ` / ${product.subcategory}`}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Checkbox
                      checked={!!product.featured}
                      onCheckedChange={(checked) =>
                        toggleFeatured(product, !!checked)
                      }
                      disabled={updatingId === product.id}
                    />
                    {product.featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
