import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isSortOption, SORT_OPTIONS } from "@/lib/collections"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get("collection")
    const sort = searchParams.get("sort") || SORT_OPTIONS.DEFAULT

    if (!collection) {
      return NextResponse.json({ error: "Collection is required" }, { status: 400 })
    }

    if (!isSortOption(sort)) {
      return NextResponse.json({ error: "Invalid sort option" }, { status: 400 })
    }

    const [sortField, sortOrder] = sort.split("-") as ["name" | "price", "asc" | "desc"]

    const products = await prisma.product.findMany({
      where: {
        collections: {
          has: collection,
        },
      },
      include: {
        sizeVariants: true,
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

