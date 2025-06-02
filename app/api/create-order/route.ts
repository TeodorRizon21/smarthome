import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification, sendOrderConfirmation } from '@/lib/email'

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

    const total = Math.max(0, subtotal + shipping - discountAmount)

    // Separate regular products and bundles
    const regularItems = []
    const bundleItems = []

    for (const item of items) {
      const isBundle = item.product?.id?.toString().startsWith('bundle-')
      
      if (isBundle) {
        bundleItems.push(item)
      } else {
        regularItems.push(item)
      }
    }

    console.log("Regular items:", regularItems.map(item => ({ id: item.product.id, name: item.product.name })));
    console.log("Bundle items:", bundleItems.map(item => ({ id: item.product.id, bundleId: item.product.id.replace('bundle-', ''), name: item.product.name })));

    // Verifică dacă toate produsele normale există în baza de date
    if (regularItems.length > 0) {
      const productIds = regularItems.map(item => item.product.id)
      console.log("Produse de verificat:", productIds);
      
      const existingProducts = await prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        },
        select: {
          id: true
        }
      })
      
      console.log("Produse găsite în baza de date:", existingProducts.map(p => p.id));

      // Verifică dacă avem același număr de produse găsite ca și în comanda
      if (existingProducts.length !== productIds.length) {
        const foundIds = existingProducts.map(p => p.id)
        const missingIds = productIds.filter(id => !foundIds.includes(id))
        console.log("Produse lipsă:", missingIds);
        return NextResponse.json({ 
          error: `Unul sau mai multe produse nu mai există în stoc: ${missingIds.join(', ')}` 
        }, { status: 400 })
      }
    }

    // Verifică dacă toate pachetele există în baza de date
    if (bundleItems.length > 0) {
      // Corectează extragerea ID-urilor de bundle
      const bundleIds = bundleItems.map(item => {
        const fullId = item.product.id;
        if (fullId.startsWith('bundle-')) {
          return fullId.substring(7); // Scoate 'bundle-' din față
        }
        return fullId; // În caz că nu are prefix, folosește id-ul așa cum este
      });
      
      console.log("Bundle-uri de verificat (corectate):", bundleIds);
      
      // Încearcă să găsești fiecare pachet individual pentru debugging
      for (const bundleId of bundleIds) {
        try {
          const bundle = await prisma.bundle.findUnique({
            where: { id: bundleId },
            select: { id: true }
          });
          console.log(`Verificare bundle ${bundleId}: ${bundle ? 'găsit' : 'negăsit'}`);
        } catch (err) {
          console.error(`Eroare la verificarea bundle-ului ${bundleId}:`, err);
        }
      }
      
      const existingBundles = await prisma.bundle.findMany({
        where: {
          id: {
            in: bundleIds
          }
        },
        select: {
          id: true
        }
      })
      
      console.log("Bundle-uri găsite în baza de date:", existingBundles.map(b => b.id));

      // Verifică dacă avem același număr de pachete găsite ca și în comanda
      if (existingBundles.length !== bundleIds.length) {
        const foundIds = existingBundles.map(b => b.id)
        const missingIds = bundleIds.filter(id => !foundIds.includes(id))
        console.log("Bundle-uri lipsă:", missingIds);
        return NextResponse.json({ 
          error: `Unul sau mai multe pachete nu mai există în stoc: ${missingIds.join(', ')}` 
        }, { status: 400 })
      }
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
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
      },
    })

    // Send admin notification
    await sendAdminNotification(order)

    // Send order confirmation to customer
    await sendOrderConfirmation(order)

    // Update discount code usage
    for (const discount of (appliedDiscounts || [])) {
      await prisma.discountCode.update({
        where: { code: discount.code },
        data: {
          totalUses: { increment: 1 },
          usesLeft: discount.usesLeft !== null ? { decrement: 1 } : undefined,
        },
      })
    }

    return NextResponse.json({ orderId: order.id })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'A apărut o eroare la crearea comenzii' },
      { status: error.statusCode || 500 }
    )
  }
}

