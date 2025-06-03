import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Product {
  collections: string[];
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        collections: true
      }
    });
    
    const categories = new Set<string>();
    categories.add("all");
    
    products.forEach((product: Product) => {
      product.collections.forEach((category: string) => {
        categories.add(category);
      });
    });

    const formattedCategories = Array.from(categories).map(category => ({
      id: category,
      name: category === "all" ? "Toate Produsele" : category
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 