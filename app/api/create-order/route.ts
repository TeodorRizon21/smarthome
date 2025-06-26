import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification, sendOrderConfirmation } from '@/lib/email'
import { generateOrderNumber } from '@/lib/order-number'

interface Product {
  id: string;
}

interface Bundle {
  id: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, userId, detailsId, paymentType, appliedDiscounts } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Nu există produse în coș' }, { status: 400 })
    }

    if (!detailsId) {
      return NextResponse.json({ error: 'Detaliile comenzii sunt obligatorii' }, { status: 400 })
    }

    // Verifică dacă detaliile comenzii există și dacă email-ul este valid
    const orderDetails = await prisma.orderDetails.findUnique({
      where: { id: detailsId }
    })

    if (!orderDetails) {
      return NextResponse.json({ error: 'Detaliile comenzii nu au fost găsite' }, { status: 400 })
    }

    // Validare email simplă
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(orderDetails.email)) {
      return NextResponse.json({ error: 'Adresa de email nu este validă' }, { status: 400 })
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + item.variant.price * item.quantity, 0)
    const shipping = 15 // Fixed shipping cost
    const discountAmount = (appliedDiscounts || []).reduce((acc: number, discount: any) => {
      if (discount.type === 'percentage') {
        return acc + (subtotal * discount.value / 100)
      } else if (discount.type === 'fixed') {
        return acc + discount.value
      } else if (discount.type === 'free_shipping') {
        return acc + shipping
      }
      return acc
    }, 0)

    const total = subtotal + shipping - discountAmount

    // Separate regular items and bundle items
    const regularItems = items.filter((item: any) => !item.product.id.startsWith('bundle-'))
    const bundleItems = items.filter((item: any) => item.product.id.startsWith('bundle-'))

    // Validate regular items stock
    if (regularItems.length > 0) {
      const productIds = regularItems.map((item: any) => item.product.id)
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds }
        }
      })

      if (products.length !== productIds.length) {
        const foundIds = products.map((p: Product) => p.id)
        const missingIds = productIds.filter(id => !foundIds.includes(id))
        console.log("Produse lipsă:", missingIds);
        return NextResponse.json({ 
          error: `Unul sau mai multe produse nu mai există în stoc: ${missingIds.join(', ')}` 
        }, { status: 400 })
      }

      // Check stock for each product
      for (const item of regularItems) {
        const product = products.find((p: any) => p.id === item.product.id)
        if (!product) continue // We already handled missing products above

        // Get the size variant if it exists
        const sizeVariant = await prisma.sizeVariant.findFirst({
          where: {
            productId: product.id,
            size: item.selectedSize
          }
        })

        // Check if we should use the size variant stock or the main product stock
        const currentStock = sizeVariant ? sizeVariant.stock : product.stock

        if (currentStock < item.quantity && !product.allowOutOfStock) {
          return NextResponse.json({ 
            error: `Produsul ${product.name} nu mai are stoc suficient. Stoc disponibil: ${currentStock}` 
          }, { status: 400 })
        }
      }

      // Update stock for products
      for (const item of regularItems) {
        const sizeVariant = await prisma.sizeVariant.findFirst({
          where: {
            productId: item.product.id,
            size: item.selectedSize
          }
        })

        if (sizeVariant) {
          // Update size variant stock
          await prisma.sizeVariant.update({
            where: { id: sizeVariant.id },
            data: { stock: { decrement: item.quantity } }
          })
        } else {
          // Update main product stock
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.quantity } }
          })
        }
      }
    }

    // Validate bundle items stock
    if (bundleItems.length > 0) {
      const bundleIds = bundleItems.map((item: any) => {
        const fullId = item.product.id;
        return fullId.startsWith('bundle-') ? fullId.substring(7) : fullId;
      });

      const existingBundles = await prisma.bundle.findMany({
        where: {
          id: { in: bundleIds }
        }
      });

      if (existingBundles.length !== bundleIds.length) {
        const foundIds = existingBundles.map((b: Bundle) => b.id)
        const missingIds = bundleIds.filter(id => !foundIds.includes(id))
        console.log("Bundle-uri lipsă:", missingIds);
        return NextResponse.json({ 
          error: `Unul sau mai multe pachete nu mai există în stoc: ${missingIds.join(', ')}` 
        }, { status: 400 })
      }

      // Check and update stock for bundles
      for (const item of bundleItems) {
        const bundleId = item.product.id.startsWith('bundle-') 
          ? item.product.id.substring(7) 
          : item.product.id;
        
        const bundle = existingBundles.find((b: any) => b.id === bundleId);
        if (!bundle) continue; // We already handled missing bundles above

        if (bundle.stock < item.quantity && !bundle.allowOutOfStock) {
          return NextResponse.json({ 
            error: `Pachetul ${bundle.name} nu mai are stoc suficient. Stoc disponibil: ${bundle.stock}` 
          }, { status: 400 })
        }

        // Update bundle stock
        await prisma.bundle.update({
          where: { id: bundleId },
          data: { stock: { decrement: item.quantity } }
        })
      }
    }

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null, // Allow null for guest orders
        total,
        paymentStatus: paymentType === 'card' ? 'COMPLETED' : 'PENDING',
        orderStatus: 'Comanda este in curs de procesare',
        paymentType,
        orderType: bundleItems.length > 0 && regularItems.length === 0 ? 'bundle' : 'product',
        details: { connect: { id: detailsId } },
        items: regularItems.length > 0 ? {
          create: regularItems.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            price: item.variant.price,
          }))
        } : undefined,
        BundleOrder: bundleItems.length > 0 ? {
          create: bundleItems.map((item: any) => {
            const fullId = item.product.id;
            const bundleId = fullId.startsWith('bundle-') ? fullId.substring(7) : fullId;
            console.log(`Creează Bundle Order: ${bundleId} din ${fullId}`);
            return {
              bundleId: bundleId,
              quantity: item.quantity,
              price: item.variant.price
            }
          })
        } : undefined,
        discountCodes: {
          create: (appliedDiscounts || []).map((discount: any) => ({
            discountCode: { connect: { code: discount.code } }
          }))
        }
      },
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
      }
    })

    // Send email notifications
    try {
      await sendOrderConfirmation(order)
      await sendAdminNotification(order)
    } catch (error) {
      console.error('Error sending email notifications:', error)
      // Don't return error to client, as order was created successfully
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

