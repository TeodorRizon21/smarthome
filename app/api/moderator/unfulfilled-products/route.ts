import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SizeVariant {
  id: string;
  size: string;
  stock: number;
  price: number;
  oldPrice: number | null;
  lowStockThreshold: number | null;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  images: string[];
  stock: number;
  sizeVariants: SizeVariant[];
}

interface OrderItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}

interface BundleItem {
  id: string;
  product: Product;
  quantity: number;
}

interface Bundle {
  items: BundleItem[];
}

interface BundleOrder {
  bundle: Bundle;
  quantity: number;
}

interface OrderDetails {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  isCompany: boolean;
  companyName?: string;
  companyCUI?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCounty?: string;
}

interface UnfulfilledOrder {
  id: string;
  userId: string | null;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  paymentType: string;
  courier?: string | null;
  awb?: string | null;
  createdAt: Date;
  items: OrderItem[];
  BundleOrder: BundleOrder[];
  details: OrderDetails;
}

export async function GET() {
  try {
    // Obține comenzile care nu sunt finalizate
    const unfulfilledOrders = await prisma.order.findMany({
      where: {
        orderStatus: {
          not: 'Comanda finalizata!'
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                stock: true,
                sizeVariants: true
              }
            }
          }
        },
        BundleOrder: {
          include: {
            bundle: {
              include: {
                items: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        images: true,
                        stock: true,
                        sizeVariants: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        details: true
      }
    }) as UnfulfilledOrder[];

    // Structura pentru a ține evidența produselor necesare
    type ProductNeed = {
      productId: string;
      productName: string;
      size: string;
      quantity: number;
      image: string;
      stock: number;
      sizeStock: number | null;
    };

    // Obiect pentru a ține evidența produselor și a cantităților
    const productNeeds: Record<string, ProductNeed> = {};

    type UnfulfilledOrderItem = UnfulfilledOrder['items'][number];
    type UnfulfilledBundleOrder = UnfulfilledOrder['BundleOrder'][number];
    type UnfulfilledBundleItem = UnfulfilledBundleOrder['bundle']['items'][number];

    // Parcurge toate comenzile pentru a aduna produsele necesare
    unfulfilledOrders.forEach((order: UnfulfilledOrder) => {
      // Verificăm produsele individuale
      order.items.forEach((item: UnfulfilledOrderItem) => {
        const key = `${item.product.id}_${item.size}`;
        const sizeVariant = item.product.sizeVariants?.find((v: SizeVariant) => v.size === item.size);
        
        if (productNeeds[key]) {
          productNeeds[key].quantity += item.quantity;
        } else {
          productNeeds[key] = {
            productId: item.product.id,
            productName: item.product.name,
            size: item.size,
            quantity: item.quantity,
            image: item.product.images?.[0] || '/placeholder.svg',
            stock: item.product.stock,
            sizeStock: sizeVariant ? sizeVariant.stock : null
          };
        }
      });

      // Verificăm produsele din bundle-uri
      order.BundleOrder.forEach((bundleOrder: UnfulfilledBundleOrder) => {
        bundleOrder.bundle.items.forEach((bundleItem: UnfulfilledBundleItem) => {
          // Pentru simplificare, produsele din bundle nu au specificată mărimea
          // Vom folosi "N/A" ca mărime pentru ele
          const key = `${bundleItem.product.id}_N/A`;
          
          if (productNeeds[key]) {
            productNeeds[key].quantity += bundleItem.quantity * bundleOrder.quantity;
          } else {
            productNeeds[key] = {
              productId: bundleItem.product.id,
              productName: bundleItem.product.name,
              size: 'N/A',
              quantity: bundleItem.quantity * bundleOrder.quantity,
              image: bundleItem.product.images?.[0] || '/placeholder.svg',
              stock: bundleItem.product.stock,
              sizeStock: null
            };
          }
        });
      });
    });

    // Transformă obiectul în array pentru răspuns
    const productNeedsArray = Object.values(productNeeds);

    // Pregătește o listă formatată a comenzilor nelivrate cu detaliile lor
    const formattedOrders = unfulfilledOrders.map((order: UnfulfilledOrder) => {
      const orderProducts = order.items.map((item: UnfulfilledOrderItem) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        size: item.size,
        quantity: item.quantity,
        image: item.product.images?.[0] || '/placeholder.svg',
        inStock: (() => {
          const sizeVariant = item.product.sizeVariants?.find((v: SizeVariant) => v.size === item.size);
          const stock = sizeVariant ? sizeVariant.stock : item.product.stock;
          return stock >= item.quantity;
        })()
      }));

      const bundleProducts = order.BundleOrder.flatMap((bundleOrder: UnfulfilledBundleOrder) =>
        bundleOrder.bundle.items.map((bundleItem: UnfulfilledBundleItem) => ({
          id: bundleItem.id,
          productId: bundleItem.product.id,
          productName: bundleItem.product.name,
          size: 'N/A',
          quantity: bundleItem.quantity * bundleOrder.quantity,
          image: bundleItem.product.images?.[0] || '/placeholder.svg',
          inStock: bundleItem.product.stock >= (bundleItem.quantity * bundleOrder.quantity)
        }))
      );

      return {
        id: order.id,
        createdAt: order.createdAt,
        customer: {
          name: order.details.fullName,
          email: order.details.email,
          phone: order.details.phoneNumber,
          address: `${order.details.street}, ${order.details.city}, ${order.details.county}, ${order.details.postalCode}`
        },
        orderStatus: order.orderStatus,
        total: order.total,
        products: [...orderProducts, ...bundleProducts],
        allProductsInStock: [...orderProducts, ...bundleProducts].every(product => product.inStock),
        courier: order.courier,
        awb: order.awb,
        details: order.details.isCompany ? {
          isCompany: order.details.isCompany,
          companyName: order.details.companyName,
          companyCUI: order.details.companyCUI,
          companyRegNumber: order.details.companyRegNumber,
          companyAddress: order.details.companyAddress,
          companyCity: order.details.companyCity,
          companyCounty: order.details.companyCounty
        } : undefined
      };
    });

    return NextResponse.json({
      productNeeds: productNeedsArray,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching unfulfilled products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unfulfilled products' },
      { status: 500 }
    );
  }
} 