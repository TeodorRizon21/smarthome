"use client";

import Link from "next/link";
import { CATEGORIES, VDP_SUBCATEGORIES } from "@/lib/categories";

export default function CollectionsNav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto py-4">
          <Link
            href="/products"
            className="text-gray-700 hover:text-black font-medium whitespace-nowrap"
          >
            All Products
          </Link>
          
          {Object.values(CATEGORIES).map((category) => (
            <div key={category} className="relative group">
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="text-gray-700 hover:text-black font-medium whitespace-nowrap"
              >
                {category}
              </Link>
              
              {/* Dropdown for Video Door Phone subcategories */}
              {category === CATEGORIES.VIDEO_DOOR_PHONE && (
                <div className="absolute top-full left-0 bg-white shadow-lg border rounded-md py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {Object.values(VDP_SUBCATEGORIES).map((subcategory) => (
                    <Link
                      key={subcategory}
                      href={`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
