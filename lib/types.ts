import { Product as PrismaProduct } from '@prisma/client'

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  collections: string[];
  allowOutOfStock: boolean;
  showStockLevel: boolean;
  pdfUrl?: string | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeVariant {
  id: string;
  productId: string;
  size: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  lowStockThreshold: number | null;
}

export interface ProductWithVariants extends Product {
  sizeVariants: SizeVariant[];
}

