import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, price, description, images, category, subcategory, colorVariants } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        images,
        category,
        subcategory,
        price: colorVariants[0]?.price || 0,
        colorVariants: {
          create: colorVariants.map((variant: any) => ({
            productCode: variant.productCode,
            color: variant.color,
            price: variant.price,
            oldPrice: variant.oldPrice
          }))
        }
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

