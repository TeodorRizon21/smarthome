"use client"

import { useState, useEffect } from "react"
import type { ProductWithVariants } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SORT_OPTIONS } from "@/lib/collections"
import ProductCard from "./ProductCard"
import { useRouter, usePathname } from "next/navigation"

interface CollectionContentProps {
  collection: string
  initialSort?: string
}

export default function CollectionContent({ collection, initialSort = SORT_OPTIONS.DEFAULT }: CollectionContentProps) {
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `/api/products/collection?collection=${encodeURIComponent(collection)}&sort=${initialSort}`,
        )
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [collection, initialSort])

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?sort=${value}`)
  }

  if (isLoading) {
    return <div className="container mx-auto px-6 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{collection}</h1>
        <Select defaultValue={initialSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.DEFAULT}>Name (A to Z)</SelectItem>
            <SelectItem value={SORT_OPTIONS.NAME_DESC}>Name (Z to A)</SelectItem>
            <SelectItem value={SORT_OPTIONS.PRICE_ASC}>Price (Low to High)</SelectItem>
            <SelectItem value={SORT_OPTIONS.PRICE_DESC}>Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

