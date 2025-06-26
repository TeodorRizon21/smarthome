import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient, Prisma } from '@prisma/client'

interface SizeVariant {
  size: string
  price: number
  oldPrice: number | null
  stock: number
  lowStockThreshold: number | null
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      productCode,
      description,
      price,
      oldPrice,
      images,
      sizes,
      collections,
      stock,
      allowOutOfStock,
      lowStockThreshold,
      showStockLevel,
      pdfUrl,
      sizeVariants
    } = body

    if (!name || !productCode || !description || images.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verifică dacă există deja un produs cu acest cod, excluzând produsul curent
    const existingProduct = await prisma.product.findFirst({
      where: {
        productCode,
        NOT: {
          id: params.productId
        }
      }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Product code already exists' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        productCode,
        description,
        price,
        oldPrice,
        images,
        sizes,
        collections,
        stock,
        allowOutOfStock,
        lowStockThreshold,
        showStockLevel,
        pdfUrl,
        sizeVariants: {
          deleteMany: {},
          create: sizeVariants.map((v: SizeVariant) => ({
            size: v.size,
            price: v.price,
            oldPrice: v.oldPrice,
            stock: v.stock,
            lowStockThreshold: v.lowStockThreshold,
          }))
        }
      },
      include: {
        sizeVariants: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

    // Check if the product is associated with any order items
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: productId },
    })

    if (orderItems.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product. It is associated with existing orders.' 
      }, { status: 400 })
    }

    // Delete associated SizeVariants first
    await prisma.sizeVariant.deleteMany({
      where: { productId: productId },
    })

    // Then delete the Product
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true, message: 'Product and associated size variants deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

