import { Prisma } from '@prisma/client'

export interface SizeVariant {
  id: string;
  size: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  lowStockThreshold: number | null;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  collections: string[];
  price: number;
  oldPrice?: number | null;
  sizes: string[];
  stock: number;
  lowStockThreshold: number | null;
  allowOutOfStock: boolean;
  showStockLevel: boolean;
  pdfUrl?: string | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  sizeVariants: SizeVariant[];
}

export interface ProductWithVariants extends Product {
  sizeVariants: SizeVariant[];
}

export interface UserDiscount {
  code: string;
  type: 'percentage' | 'free_shipping' | 'fixed';
  value?: number;
  active: boolean;
  description?: string;
}

