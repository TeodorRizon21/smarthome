import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface OrderItem {
  quantity: number;
}

interface BundleOrder {
  bundleId: string;
  quantity: number;
}

interface BundleItem {
  quantity: number;
  bundleId: string;
}

interface Order {
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
}

// Funcție pentru a calcula numărul de zile în urmă
function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// Funcție pentru a calcula numărul de ore în urmă
function getHoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

// Funcție pentru a calcula numărul de luni în urmă
function getMonthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

// Funcție pentru a calcula începutul anului trecut
function getYearAgo(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'unfulfilled';
    
    // Definim where clause pentru fiecare interogare
    let whereClause = {};
    
    switch (timeRange) {
      case 'hour':
        whereClause = { createdAt: { gte: getHoursAgo(1) } };
        break;
      case '12hours':
        whereClause = { createdAt: { gte: getHoursAgo(12) } };
        break;
      case 'day':
        whereClause = { createdAt: { gte: getDaysAgo(1) } };
        break;
      case '2days':
        whereClause = { createdAt: { gte: getDaysAgo(2) } };
        break;
      case 'week':
        whereClause = { createdAt: { gte: getDaysAgo(7) } };
        break;
      case 'month':
        whereClause = { createdAt: { gte: getDaysAgo(30) } };
        break;
      case '2months':
        whereClause = { createdAt: { gte: getMonthsAgo(2) } };
        break;
      case '6months':
        whereClause = { createdAt: { gte: getMonthsAgo(6) } };
        break;
      case 'year':
        whereClause = { createdAt: { gte: getYearAgo() } };
        break;
      case 'all':
        whereClause = {};
        break;
      case 'unfulfilled':
      default:
        whereClause = { orderStatus: { not: 'Comanda finalizata!' } };
        break;
    }

    // 1. Numărul total de comenzi
    const orderCount = await prisma.order.count({
      where: whereClause
    });

    // 2. Numărul total de produse individuale din comenzi
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          is: whereClause
        }
      },
      select: {
        quantity: true,
      },
    });
    
    // Calculăm numărul total de produse individuale
    const totalIndividualProducts = orderItems.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);

    // 3. Obținem toate bundle-urile comandate care se potrivesc criteriilor
    const bundleOrders = await prisma.bundleOrder.findMany({
      where: {
        order: {
          is: whereClause
        }
      },
      select: {
        quantity: true,
        bundleId: true,
      },
    });

    // Obținem toate ID-urile bundle-urilor pentru a putea calcula numărul total de produse
    const bundleIds = bundleOrders.map((order: BundleOrder) => order.bundleId);

    let totalBundleProducts = 0;
    
    if (bundleIds.length > 0) {
      // Obținem toate produsele din bundle-uri
      const bundleItems = await prisma.bundleItem.findMany({
        where: {
          bundleId: {
            in: bundleIds
          }
        },
        select: {
          quantity: true,
          bundleId: true,
        },
      });

      // Creăm un map pentru a ține evidența numărului de produse din fiecare bundle
      const bundleProductsMap = new Map<string, number>();

      bundleItems.forEach((item: BundleItem) => {
        const currentTotal = bundleProductsMap.get(item.bundleId) || 0;
        bundleProductsMap.set(item.bundleId, currentTotal + item.quantity);
      });

      // Calculăm numărul total de produse din bundle-uri, luând în considerare cantitatea bundle-urilor comandate
      bundleOrders.forEach((order: BundleOrder) => {
        const productsInBundle = bundleProductsMap.get(order.bundleId) || 0;
        totalBundleProducts += productsInBundle * order.quantity;
      });
    }

    // Calculăm numărul total de produse (individuale + din bundle-uri)
    const totalProducts = totalIndividualProducts + totalBundleProducts;

    // 4. Suma totală a comenzilor
    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        total: true,
      },
    });
    
    // Calculăm suma totală
    const totalAmount = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);

    return NextResponse.json({
      orderCount,
      totalProducts,
      totalIndividualProducts,
      totalBundleProducts,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
} 