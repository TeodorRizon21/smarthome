import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, price, description, sizes, images } = body

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        sizes,
        images,
        stock: 0,
        allowOutOfStock: false,
        showStockLevel: false,
      },
    })
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

