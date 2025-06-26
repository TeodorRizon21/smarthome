import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATEGORIES, VDP_SUBCATEGORIES } from '@/lib/categories';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        category: true,
        subcategory: true
      }
    });
    
    const categories = new Set<string>();
    categories.add("all");
    
    // Add main categories
    Object.values(CATEGORIES).forEach(category => {
      categories.add(category);
    });
    
    // Add subcategories for Video Door Phone
    Object.values(VDP_SUBCATEGORIES).forEach(subcategory => {
      categories.add(subcategory);
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