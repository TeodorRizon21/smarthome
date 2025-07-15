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

  colorVariants: {
    id: string;
    color: string;
    price: number;
    oldPrice: number | null;
    productCode: string;
  }[];

}

interface OrderItem {
  id: string;
  product: Product;

  color: string;

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
  companyName?: string | null;
  companyCUI?: string | null;
  companyRegNumber?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyCounty?: string | null;
}

interface UnfulfilledOrder {
  id: string;
  orderNumber: string;
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
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        total: true,
        paymentStatus: true,
        orderStatus: true,
        paymentType: true,
        courier: true,
        awb: true,
        createdAt: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,

                images: true,
                colorVariants: true

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
                        colorVariants: true

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
    });

    // Structura pentru a ține evidența produselor necesare
    type ProductNeed = {
      productId: string;
      productName: string;
      color: string;
      quantity: number;
      image: string;

      productCode: string | null;

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

        const key = `${item.product.id}_${item.color}`;
        const colorVariant = item.product.colorVariants?.find(v => v.color === item.color);
        
        if (productNeeds[key]) {
          productNeeds[key].quantity += item.quantity;
        } else {
          productNeeds[key] = {
            productId: item.product.id,
            productName: item.product.name,

            color: item.color,
            quantity: item.quantity,
            image: item.product.images?.[0] || '/placeholder.svg',
            productCode: colorVariant?.productCode || null

          };
        }
      });

      // Verificăm produsele din bundle-uri
      order.BundleOrder.forEach((bundleOrder: UnfulfilledBundleOrder) => {
        bundleOrder.bundle.items.forEach((bundleItem: UnfulfilledBundleItem) => {

          // Pentru bundle-uri, vom folosi prima variantă de culoare disponibilă
          const colorVariant = bundleItem.product.colorVariants?.[0];
          const key = `${bundleItem.product.id}_${colorVariant?.color || 'default'}`;
          

          if (productNeeds[key]) {
            productNeeds[key].quantity += bundleItem.quantity * bundleOrder.quantity;
          } else {
            productNeeds[key] = {
              productId: bundleItem.product.id,
              productName: bundleItem.product.name,
              color: colorVariant?.color || 'default',
              quantity: bundleItem.quantity * bundleOrder.quantity,
              image: bundleItem.product.images?.[0] || '/placeholder.svg',

              productCode: colorVariant?.productCode || null

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

        color: item.color,
        quantity: item.quantity,
        image: item.product.images?.[0] || '/placeholder.svg',
        productCode: item.product.colorVariants?.find(v => v.color === item.color)?.productCode || null
      }));

      const bundleProducts = order.BundleOrder.flatMap((bundleOrder: UnfulfilledBundleOrder) =>
        bundleOrder.bundle.items.map((bundleItem: UnfulfilledBundleItem) => {
          const colorVariant = bundleItem.product.colorVariants?.[0];
          return {
            id: bundleItem.id,
            productId: bundleItem.product.id,
            productName: bundleItem.product.name,
            color: colorVariant?.color || 'default',
            quantity: bundleItem.quantity * bundleOrder.quantity,
            image: bundleItem.product.images?.[0] || '/placeholder.svg',
            productCode: colorVariant?.productCode || null
          };
        })

      );

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,

        paymentStatus: order.paymentStatus,
        paymentType: order.paymentType,

        courier: order.courier,
        awb: order.awb,
        total: order.total,
        details: order.details,
        products: [...orderProducts, ...bundleProducts]
      };
    });

    return NextResponse.json({
      productNeeds: productNeedsArray,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching unfulfilled products:', error);
    return NextResponse.json(
      { error: 'Error fetching unfulfilled products' },
      { status: 500 }
    );
  }
} 