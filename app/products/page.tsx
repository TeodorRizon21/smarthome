"use client";

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { ProductWithVariants } from '@/lib/types';

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/products/categories'),
          fetch('/api/admin/products')
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesRes.json(),
          productsRes.json()
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = [...products]
    .filter(product => 
      selectedCategory === "all" || product.collections.includes(selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.sizeVariants[0].price - b.sizeVariants[0].price;
      if (sortBy === "price-desc") return b.sizeVariants[0].price - a.sizeVariants[0].price;
      return 0; // featured
    });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Client Side Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredAndSortedProducts} />
          </div>
        </div>
      </div>
    </main>
  );
} 