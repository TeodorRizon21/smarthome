"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Eye, MoreVertical, Package, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export default function AdminBundleList() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await fetch("/api/admin/bundles");
      if (!response.ok) {
        throw new Error("Failed to fetch bundles");
      }
      const data = await response.json();
      setBundles(data);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast({
        title: "Eroare",
        description:
          "Nu s-au putut încărca bundle-urile. Încearcă din nou mai târziu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest bundle?")) {
      try {
        const response = await fetch(`/api/admin/bundles/${bundleId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete bundle");
        }

        setBundles(bundles.filter((b) => b.id !== bundleId));
        toast({
          title: "Succes",
          description: "Bundle-ul a fost șters cu succes.",
        });
      } catch (error) {
        console.error("Error deleting bundle:", error);
        toast({
          title: "Eroare",
          description:
            error instanceof Error
              ? error.message
              : "Nu s-a putut șterge bundle-ul.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {bundles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Nu există bundle-uri</h3>
          <p className="mb-6 text-gray-500">
            Nu ai creat încă niciun bundle. Începe prin a adăuga primul tău
            bundle.
          </p>
          <Link href="/admin/bundles/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Bundle Nou
            </Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[300px]">Bundle</TableHead>
              <TableHead>Preț</TableHead>
              <TableHead>Produse Incluse</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.map((bundle) => (
              <TableRow key={bundle.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <img
                      src={bundle.images[0] || "/placeholder-image.jpg"}
                      alt={bundle.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium">{bundle.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {bundle.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ${bundle.price.toFixed(2)}
                    </span>
                    {bundle.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${bundle.oldPrice.toFixed(2)}
                      </span>
                    )}
                    {bundle.discount && bundle.discount > 0 && (
                      <span className="text-xs text-green-600 font-medium">
                        {bundle.discount}% reducere
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1 max-h-24 overflow-y-auto">
                    {bundle.items.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.quantity} x {item.product.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/admin/bundles/${bundle.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/admin/bundles/edit/${bundle.id}`}>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDeleteBundle(bundle.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
