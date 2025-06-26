import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SizeVariant {
  size: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  lowStockThreshold: number | null;
}

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        sizeVariants: true // Include size variants in the response
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
      productCode,
      description, 
      images, 
      collections,
      allowOutOfStock,
      showStockLevel,
      sizeVariants,
      pdfUrl
    } = body

    if (!name || !productCode || !description || images.length === 0 || sizeVariants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verifică dacă există deja un produs cu acest cod
    const existingProduct = await prisma.product.findUnique({
      where: { productCode }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Product code already exists' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        productCode,
        description,
        images,
        collections,
        allowOutOfStock,
        showStockLevel,
        pdfUrl,
        price: sizeVariants[0].price,
        oldPrice: sizeVariants[0].oldPrice,
        sizes: sizeVariants.map((v: SizeVariant) => v.size),
        stock: sizeVariants.reduce((total: number, v: SizeVariant) => total + v.stock, 0),
        lowStockThreshold: Math.min(...sizeVariants.map((v: SizeVariant) => v.lowStockThreshold || Infinity)),
        sizeVariants: {
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
      collections,
      allowOutOfStock,
      showStockLevel,
      sizeVariants,
      pdfUrl
    } = body

    if (!id || !name || !description || images.length === 0 || sizeVariants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        images,
        collections,
        allowOutOfStock,
        showStockLevel,
        pdfUrl,
        price: sizeVariants[0].price,
        oldPrice: sizeVariants[0].oldPrice,
        sizes: sizeVariants.map((v: SizeVariant) => v.size),
        stock: sizeVariants.reduce((total: number, v: SizeVariant) => total + v.stock, 0),
        lowStockThreshold: Math.min(...sizeVariants.map((v: SizeVariant) => v.lowStockThreshold || Infinity)),
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

