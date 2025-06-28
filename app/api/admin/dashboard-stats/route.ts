import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { OrderItem, BundleOrder } from '@prisma/client';

export async function GET() {
  try {
    // Verificăm dacă utilizatorul este admin
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: {
        paymentStatus: 'COMPLETED'
      }
    });

    // Get active discounts
    const activeDiscounts = await prisma.discountCode.count({
      where: {
        OR: [
          {
            expirationDate: {
              gt: new Date(),
            },
          },
          {
            expirationDate: null,
          },
        ],
        usesLeft: {
          gt: 0,
        },
      },
    });

    // Get total revenue and sales from completed orders
    const orderStats = await prisma.order.findMany({
      where: {
        paymentStatus: 'COMPLETED',
      },
      include: {
        items: true,
        BundleOrder: true,
      },
    });

    let totalRevenue = 0;
    let totalSales = 0;

    for (const order of orderStats) {
      totalRevenue += order.total;
      totalSales += order.items.reduce((acc: number, item: OrderItem) => acc + item.quantity, 0);
      totalSales += order.BundleOrder.reduce((acc: number, bundle: BundleOrder) => acc + bundle.quantity, 0);
    }

    return NextResponse.json({
      totalProducts,
      totalOrders,
      activeDiscounts,
      totalRevenue,
      totalSales,
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 