'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from '@/hooks/use-toast'
import ImageUpload from "@/components/ImageUpload"
import type { Product } from '@/lib/types'
import { COLLECTIONS } from '@/lib/collections'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface SizeVariant {
  id?: string
  size: string
  price: string
  oldPrice: string
  stock: string
  lowStockThreshold: string
}

type AdminPanelProps = {
  product?: Product & {
    sizeVariants: Array<{
      id: string
      size: string
      price: number
      oldPrice: number | null
      stock: number
      lowStockThreshold: number | null
    }>
  }
}

export default function AdminPanel({ product }: AdminPanelProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [collections, setCollections] = useState<string[]>(
    product?.collections || [COLLECTIONS.ALL]
  )
  const [allowOutOfStock, setAllowOutOfStock] = useState(product?.allowOutOfStock || false)
  const [showStockLevel, setShowStockLevel] = useState(product?.showStockLevel || false)
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>(
    product?.sizeVariants.map((variant: { id: string; size: string; price: number; oldPrice: number | null; stock: number; lowStockThreshold: number | null }) => ({
      id: variant.id,
      size: variant.size,
      price: variant.price.toString(),
      oldPrice: variant.oldPrice?.toString() || '',
      stock: variant.stock.toString(),
      lowStockThreshold: variant.lowStockThreshold?.toString() || ''
    })) || []
  )
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCollectionToggle = (collection: string) => {
    if (collection === COLLECTIONS.ALL) return
    if (collection === COLLECTIONS.SALES) return

    setCollections(prev => {
      if (prev.includes(collection)) {
        return prev.filter(c => c !== collection)
      } else {
        return [...prev, collection]
      }
    })
  }

  const addSizeVariant = () => {
    setSizeVariants([...sizeVariants, {
      size: '',
      price: '',
      oldPrice: '',
      stock: '0',
      lowStockThreshold: ''
    }])
  }

  const removeSizeVariant = (index: number) => {
    setSizeVariants(sizeVariants.filter((_, i) => i !== index))
  }

  const updateSizeVariant = (index: number, field: keyof SizeVariant, value: string) => {
    const newVariants = [...sizeVariants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setSizeVariants(newVariants)

    // Update collections if any variant has an old price
    const hasOldPrice = newVariants.some(variant => 
      variant.oldPrice && parseFloat(variant.oldPrice) > parseFloat(variant.price)
    )
    if (hasOldPrice && !collections.includes(COLLECTIONS.SALES)) {
      setCollections(prev => [...prev, COLLECTIONS.SALES])
    } else if (!hasOldPrice) {
      setCollections(prev => prev.filter(c => c !== COLLECTIONS.SALES))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (sizeVariants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one size variant",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate size variants
    for (const variant of sizeVariants) {
      if (!variant.size || !variant.price) {
        toast({
          title: "Error",
          description: "All size variants must have a size and price",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (variant.oldPrice && parseFloat(variant.oldPrice) <= parseFloat(variant.price)) {
        toast({
          title: "Error",
          description: "Old price must be greater than current price",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    try {
      const response = await fetch(product ? `/api/admin/products/${product.id}` : '/api/admin/products', {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          images,
          collections,
          allowOutOfStock,
          showStockLevel,
          sizeVariants: sizeVariants.map(variant => ({
            id: variant.id,
            size: variant.size,
            price: parseFloat(variant.price),
            oldPrice: variant.oldPrice ? parseFloat(variant.oldPrice) : null,
            stock: parseInt(variant.stock),
            lowStockThreshold: variant.lowStockThreshold ? parseInt(variant.lowStockThreshold) : null,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product added successfully",
      })
      router.push('/admin/products')
    } catch (error) {
      console.error('Error adding/updating product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add/update product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Collections</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {Object.values(COLLECTIONS).map((collection) => (
            <div key={collection} className="flex items-center space-x-2">
              <Checkbox
                id={`collection-${collection}`}
                checked={collections.includes(collection)}
                onCheckedChange={() => handleCollectionToggle(collection)}
                disabled={collection === COLLECTIONS.ALL || collection === COLLECTIONS.SALES}
              />
              <Label htmlFor={`collection-${collection}`}>{collection}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Product Images (up to 10)</Label>
        <ImageUpload 
          value={images} 
          onChange={(urls) => setImages(urls)} 
          maxFiles={10}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Size Variants</Label>
          <Button type="button" onClick={addSizeVariant}>
            Add Size Variant
          </Button>
        </div>
        
        <div className="space-y-4">
          {sizeVariants.map((variant, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Input
                      value={variant.size}
                      onChange={(e) => updateSizeVariant(index, 'size', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateSizeVariant(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Old Price (optional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.oldPrice}
                      onChange={(e) => updateSizeVariant(index, 'oldPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateSizeVariant(index, 'stock', e.target.value)}
                      required
                    />
                  </div>
                  {showStockLevel && (
                    <div>
                      <Label>Low Stock Threshold</Label>
                      <Input
                        type="number"
                        value={variant.lowStockThreshold}
                        onChange={(e) => updateSizeVariant(index, 'lowStockThreshold', e.target.value)}
                      />
                    </div>
                  )}
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSizeVariant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="allowOutOfStock"
            checked={allowOutOfStock}
            onCheckedChange={(checked) => setAllowOutOfStock(checked as boolean)}
          />
          <Label htmlFor="allowOutOfStock">Allow sales when out of stock</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showStockLevel"
            checked={showStockLevel}
            onCheckedChange={(checked) => setShowStockLevel(checked as boolean)}
          />
          <Label htmlFor="showStockLevel">Show stock level to customers</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (product ? 'Updating...' : 'Adding...') : (product ? 'Update Product' : 'Add Product')}
      </Button>
    </form>
  )
}

