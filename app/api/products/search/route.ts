import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get('term')

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { startsWith: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 5, // Limit to 5 results
      orderBy: [
        { name: 'asc' }, // Prioritize exact matches
      ],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}

