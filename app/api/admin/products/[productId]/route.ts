import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient, Prisma } from '@prisma/client'

interface ColorVariant {
  id?: string;
  productCode: string;
  color: string;
  price: number;
  oldPrice: number | null;
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      images,
      category,
      subcategory,
      colorVariants,
      pdfUrl,
      tags
    } = body

    if (!name || !description || images.length === 0 || colorVariants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that all product codes are unique
    const productCodes = colorVariants.map((v: ColorVariant) => v.productCode);
    const uniqueProductCodes = new Set(productCodes);
    if (productCodes.length !== uniqueProductCodes.size) {
      return NextResponse.json({ error: 'All product codes must be unique' }, { status: 400 })
    }

    // Check for duplicate product codes in other products
    const existingProducts = await prisma.product.findMany({
      where: {
        colorVariants: {
          some: {
            productCode: {
              in: productCodes
            }
          }
        },
        NOT: {
          id: params.productId
        }
      },
      include: {
        colorVariants: {
          where: {
            productCode: {
              in: productCodes
            }
          }
        }
      }
    });

    if (existingProducts.length > 0) {
      const duplicateCodes = existingProducts.flatMap(p => 
        p.colorVariants.map(v => v.productCode)
      );
      return NextResponse.json({ 
        error: `Product codes already exist: ${duplicateCodes.join(', ')}` 
      }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        description,
        images,
        category,
        subcategory,
        pdfUrl,
        tags: tags || [],
        colorVariants: {
          deleteMany: {},
          create: colorVariants.map((v: ColorVariant) => ({
            productCode: v.productCode,
            color: v.color,
            price: v.price,
            oldPrice: v.oldPrice,
          }))
        }
      },
      include: {
        colorVariants: true
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

    // Delete associated ColorVariants first
    await prisma.colorVariant.deleteMany({
      where: { productId: productId },
    })

    // Then delete the Product
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true, message: 'Product and associated color variants deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

