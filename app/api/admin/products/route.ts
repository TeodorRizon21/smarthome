import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ColorVariant {
  id?: string;
  productCode: string;
  color: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  lowStockThreshold: number | null;
}

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        colorVariants: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      images, 
      category,
      subcategory,
      allowOutOfStock,
      showStockLevel,
      colorVariants,
      pdfUrl
    } = body

    if (!name || !description || images.length === 0 || colorVariants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if any color variant has a duplicate product code
    const productCodes = colorVariants.map((v: ColorVariant) => v.productCode);
    const existingColorVariants = await prisma.colorVariant.findMany({
      where: {
        productCode: {
          in: productCodes
        }
      }
    });

    if (existingColorVariants.length > 0) {
      return NextResponse.json({ 
        error: `Product codes already exist: ${existingColorVariants.map(v => v.productCode).join(', ')}` 
      }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        images,
        category,
        subcategory,
        allowOutOfStock,
        showStockLevel,
        pdfUrl,
        price: colorVariants[0].price,
        oldPrice: colorVariants[0].oldPrice,
        stock: colorVariants.reduce((total: number, v: ColorVariant) => total + v.stock, 0),
        lowStockThreshold: Math.min(...colorVariants.map((v: ColorVariant) => v.lowStockThreshold || Infinity)),
        colorVariants: {
          create: colorVariants.map((v: ColorVariant) => ({
            productCode: v.productCode,
            color: v.color,
            price: v.price,
            oldPrice: v.oldPrice,
            stock: v.stock,
            lowStockThreshold: v.lowStockThreshold,
          }))
        }
      },
      include: {
        colorVariants: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { 
      id,
      name, 
      description, 
      images, 
      category,
      subcategory,
      allowOutOfStock,
      showStockLevel,
      colorVariants,
      pdfUrl
    } = body

    if (!id || !name || !description || images.length === 0 || colorVariants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if any color variant has a duplicate product code (excluding existing ones for this product)
    const productCodes = colorVariants.map((v: ColorVariant) => v.productCode);
    const existingColorVariants = await prisma.colorVariant.findMany({
      where: {
        productCode: {
          in: productCodes
        },
        productId: {
          not: id
        }
      }
    });

    if (existingColorVariants.length > 0) {
      return NextResponse.json({ 
        error: `Product codes already exist: ${existingColorVariants.map(v => v.productCode).join(', ')}` 
      }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        images,
        category,
        subcategory,
        allowOutOfStock,
        showStockLevel,
        pdfUrl,
        price: colorVariants[0].price,
        oldPrice: colorVariants[0].oldPrice,
        stock: colorVariants.reduce((total: number, v: ColorVariant) => total + v.stock, 0),
        lowStockThreshold: Math.min(...colorVariants.map((v: ColorVariant) => v.lowStockThreshold || Infinity)),
        colorVariants: {
          deleteMany: {},
          create: colorVariants.map((v: ColorVariant) => ({
            productCode: v.productCode,
            color: v.color,
            price: v.price,
            oldPrice: v.oldPrice,
            stock: v.stock,
            lowStockThreshold: v.lowStockThreshold,
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

