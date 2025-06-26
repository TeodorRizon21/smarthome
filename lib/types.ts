import { Prisma } from '@prisma/client'

export interface ColorVariant {
  id: string;
  productCode: string;
  color: string;
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
  category: string; // "Video Door Phone", "Home and Building Control System", "SALE"
  subcategory?: string; // "IP VDP", "SIP VDP", "2-WIRE VDP" (only for Video Door Phone)
  price: number;
  oldPrice?: number | null;
  stock: number;
  lowStockThreshold: number | null;
  allowOutOfStock: boolean;
  showStockLevel: boolean;
  pdfUrl?: string | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  colorVariants: ColorVariant[];
}

export interface ProductWithVariants extends Product {
  colorVariants: ColorVariant[];
}

export interface UserDiscount {
  code: string;
  type: 'percentage' | 'free_shipping' | 'fixed';
  value?: number;
  active: boolean;
  description?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  order: Order;
  product: Product;
}

export interface OrderDetails {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  notes: string | null;
  isCompany: boolean;
  companyName: string | null;
  companyCUI: string | null;
  companyRegNumber: string | null;
  companyCounty: string | null;
  companyCity: string | null;
  companyAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  Order: Order[];
}

export interface OrderDiscountCode {
  id: string;
  orderId: string;
  discountCodeId: string;
  order: Order;
  discountCode: DiscountCode;
}

export interface BundleOrder {
  id: string;
  orderId: string;
  bundleId: string;
  quantity: number;
  price: number;
  order: Order;
  bundle: Bundle;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  paymentType: string;
  courier: string | null;
  awb: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  details: OrderDetails;
  discountCodes: OrderDiscountCode[];
  orderType: string;
  BundleOrder: BundleOrder[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: string;
  value: number;
  usesLeft: number | null;
  totalUses: number;
  expirationDate: Date | null;
  canCumulate: boolean;
  createdAt: Date;
  updatedAt: Date;
  orders: OrderDiscountCode[];
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  stock: number;
  discount: number | null;
  allowOutOfStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: BundleItem[];
  BundleOrder: BundleOrder[];
}

export interface BundleItem {
  id: string;
  bundleId: string;
  productId: string;
  quantity: number;
  bundle: Bundle;
  product: Product;
}

