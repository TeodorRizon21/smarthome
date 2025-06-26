import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CATEGORIES, VDP_SUBCATEGORIES } from "@/lib/categories"

export const dynamic = 'force-dynamic'

const SORT_OPTIONS = {
  DEFAULT: "name-asc",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc"
} as const;

type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

function isSortOption(sort: string): sort is SortOption {
  return Object.values(SORT_OPTIONS).includes(sort as SortOption);
}

export async function GET(request: Request, { params, searchParams }: { params: {}; searchParams: { [key: string]: string | string[] | undefined } }) {
  try {
    const category = searchParams.category?.toString()
    const sort = searchParams.sort?.toString() || SORT_OPTIONS.DEFAULT

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    if (!isSortOption(sort)) {
      return NextResponse.json({ error: "Invalid sort option" }, { status: 400 })
    }

    const [sortField, sortOrder] = sort.split("-") as ["name" | "price", "asc" | "desc"]

    // Build where clause based on category
    const whereClause: any = {};
    
    if (category === "all") {
      // No filter needed for "all"
    } else if (Object.values(CATEGORIES).includes(category as any)) {
      // Main category
      whereClause.category = category;
    } else if (Object.values(VDP_SUBCATEGORIES).includes(category as any)) {
      // Subcategory
      whereClause.subcategory = category;
    } else {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        colorVariants: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

