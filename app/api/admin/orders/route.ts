import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  notes?: string;
  isCompany: boolean;
  companyName?: string;
  companyCUI?: string;
  companyRegNumber?: string;
  companyCounty?: string;
  companyCity?: string;
  companyAddress?: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  product?: {
    id: string;
    name: string;
    images: string[];
  };
}

interface BundleOrder {
  id: string;
  orderId: string;
  bundleId: string;
  quantity: number;
  price: number;
  bundle: {
    id: string;
    name: string;
    images: string[];
  };
}

interface OrderDiscountCode {
  id: string;
  orderId: string;
  discountCodeId: string;
  discountCode: {
    code: string;
    type: string;
    value: number;
  };
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
  updatedAt: Date;
  items: OrderItem[];
  BundleOrder: BundleOrder[];
  discountCodes: OrderDiscountCode[];
  orderType: string;
  details: OrderDetails;
}

interface Product {
  id: string;
  name: string;
  images: string[];
}

interface ProductMap {
  [id: string]: Product;
}

// Type that matches Prisma's return structure
type PrismaOrder = {
  id: string;
  userId: string | null;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  paymentType: string;
  courier: string | null;
  awb: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderType: string;
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    size: string;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    } | null;
  }>;
  BundleOrder: Array<{
    id: string;
    orderId: string;
    bundleId: string;
    quantity: number;
    price: number;
    bundle: {
      name: string;
      id: string;
      description: string;
      price: number;
      oldPrice: number | null;
      images: string[];
      stock: number;
      allowOutOfStock: boolean;
      createdAt: Date;
      updatedAt: Date;
      discount: number | null;
    };
  }>;
  details: {
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
  };
  discountCodes: Array<{
    id: string;
    orderId: string;
    discountCodeId: string;
    discountCode: {
      code: string;
      type: string;
      value: number;
    };
  }>;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedOrderType = searchParams.get('type')

    console.log("Fetching orders with type:", requestedOrderType || "all");

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        },
        details: true,
        discountCodes: {
          include: {
            discountCode: true
          }
        },
        BundleOrder: {
          include: {
            bundle: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const filteredOrders = requestedOrderType 
      ? (orders as PrismaOrder[]).filter(order => {
          console.log(`Order ${order.id} has type '${order.orderType}', comparing with '${requestedOrderType}'`);
          
          if (requestedOrderType === 'product') {
            const isProductOrder = 
              (order.orderType === 'product' || !order.orderType) && 
              order.orderType !== 'kit' &&
              (!order.BundleOrder || order.BundleOrder.length === 0);
            
            console.log(`Order ${order.id}: isProductOrder=${isProductOrder}, orderType=${order.orderType}, BundleOrder.length=${order.BundleOrder?.length || 0}`);
            return isProductOrder;
          } 
          else if (requestedOrderType === 'bundle') {
            const isBundleOrder = order.orderType === 'bundle' && 
              order.BundleOrder && order.BundleOrder.length > 0;
            
            console.log(`Order ${order.id}: isBundleOrder=${isBundleOrder}, BundleOrder.length=${order.BundleOrder?.length || 0}`);
            return isBundleOrder;
          }
          
          return order.orderType === requestedOrderType;
        })
      : orders;

    console.log(`Found ${orders.length} total orders, filtered to ${filteredOrders.length} orders of type '${requestedOrderType || "all"}'`);

    // Preluăm toate ID-urile de produse pentru a le verifica separat
    const productIds = new Set<string>();
    filteredOrders.forEach((order: PrismaOrder) => {
      order.items.forEach(item => {
        productIds.add(item.productId);
      });
    });

    // Găsim toate produsele disponibile
    const products = productIds.size > 0 
      ? await prisma.product.findMany({
          where: { 
            id: { 
              in: Array.from(productIds) as string[]
            } 
          }
        })
      : [];
    
    // Creăm un map pentru accesare rapidă
    const productsMap: ProductMap = {};
    products.forEach((product: Product) => {
      productsMap[product.id] = product;
    });

    console.log(`Found ${products.length} products for filtered orders`);

    // Formăm răspunsul cu produsele disponibile
    const formattedOrders = filteredOrders.map((order: PrismaOrder) => ({
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      total: order.total,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      orderType: order.orderType,
      items: order.items.map(item => {
        const product = productsMap[item.productId];
        return {
          id: item.id,
          productId: item.productId,
          productName: product ? product.name : 'Produs indisponibil',
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          image: product && product.images && product.images.length > 0 
            ? product.images[0] 
            : '/placeholder.svg'
        };
      }),
      bundleOrders: order.BundleOrder.map(bundleOrder => ({
        id: bundleOrder.id,
        bundleId: bundleOrder.bundleId,
        quantity: bundleOrder.quantity,
        price: bundleOrder.price,
        bundle: bundleOrder.bundle 
          ? {
              name: bundleOrder.bundle.name,
              images: bundleOrder.bundle.images || [],
              items: []
            }
          : {
              name: 'Pachet indisponibil',
              images: [],
              items: []
            }
      })),
      details: order.details 
        ? {
            fullName: order.details.fullName,
            email: order.details.email,
            phoneNumber: order.details.phoneNumber,
            street: order.details.street,
            city: order.details.city,
            county: order.details.county,
            postalCode: order.details.postalCode,
            country: order.details.country,
            notes: order.details.notes
          }
        : {
            fullName: 'Detalii indisponibile',
            email: '',
            phoneNumber: '',
            street: '',
            city: '',
            county: '',
            postalCode: '',
            country: '',
            notes: ''
          },
      paymentType: order.paymentType,
      courier: order.courier,
      awb: order.awb,
      discountCodes: order.discountCodes.map((dc: OrderDiscountCode) => ({
        code: dc.discountCode?.code || 'unknown',
        type: dc.discountCode?.type || 'unknown',
        value: dc.discountCode?.value || 0
      }))
    }));

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, total, items, bundleOrders, details, paymentType, discountCodes, orderType } = body

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentStatus: paymentType === 'card' ? 'COMPLETED' : 'PENDING',
        orderStatus: 'Comanda este in curs de procesare',
        paymentType,
        orderType: orderType || 'product',
        details: { connect: { id: details.id } },
        items: items ? {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price
          }))
        } : undefined,
        BundleOrder: bundleOrders ? {
          create: bundleOrders.map((bundleOrder: any) => ({
            bundleId: bundleOrder.bundleId,
            quantity: bundleOrder.quantity,
            price: bundleOrder.price
          }))
        } : undefined,
        discountCodes: {
          create: (discountCodes || []).map((discount: any) => ({
            discountCode: { connect: { code: discount.code } }
          }))
        }
      },
      include: {
        items: true,
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
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, courier, awb } = body

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: status,
        courier,
        awb,
        paymentStatus: status === 'Comanda finalizata!' ? 'COMPLETED' : undefined
      },
      include: {
        items: true,
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
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

