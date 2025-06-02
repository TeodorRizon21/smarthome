import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        BundleOrder: {
          include: {
            bundle: true
          }
        },
        details: true,
        discountCodes: {
          include: {
            discountCode: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      total: order.total,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      orderType: order.orderType,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        image: item.product.images[0] || '/placeholder.svg'
      })),
      bundleOrders: order.BundleOrder.map(bundleOrder => ({
        id: bundleOrder.id,
        bundleId: bundleOrder.bundleId,
        quantity: bundleOrder.quantity,
        price: bundleOrder.price,
        bundle: bundleOrder.bundle 
          ? {
              name: bundleOrder.bundle.name,
              images: bundleOrder.bundle.images || [],
            }
          : {
              name: 'Pachet indisponibil',
              images: [],
            }
      })),
      details: {
        fullName: order.details.fullName,
        email: order.details.email,
        phoneNumber: order.details.phoneNumber,
        street: order.details.street,
        city: order.details.city,
        county: order.details.county,
        postalCode: order.details.postalCode,
        country: order.details.country,
        notes: order.details.notes,
        isCompany: order.details.isCompany,
        companyName: order.details.companyName,
        companyCUI: order.details.companyCUI,
        companyRegNumber: order.details.companyRegNumber,
        companyCounty: order.details.companyCounty,
        companyCity: order.details.companyCity,
        companyAddress: order.details.companyAddress,
      },
      paymentType: order.paymentType,
      courier: order.courier,
      awb: order.awb,
      discountCodes: order.discountCodes.map(dc => ({
        code: dc.discountCode.code,
        type: dc.discountCode.type,
        value: dc.discountCode.value
      }))
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

