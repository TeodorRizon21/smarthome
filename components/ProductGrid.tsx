import { ProductWithVariants } from '@/lib/types';
import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

interface ProductGridProps {
  products: ProductWithVariants[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
        >
          {/* Product Image */}
          <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            {product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {product.collections && product.collections.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  {product.collections[0] === COLLECTIONS.ALL ? product.collections[1] || product.collections[0] : product.collections[0]}
                </span>
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {product.sizeVariants.map((variant, index) => (
                  <div key={variant.id} className={index === 0 ? "text-lg font-semibold text-gray-900" : "text-sm text-gray-500"}>
                    {variant.size}: {variant.price.toLocaleString('ro-RO', {
                      style: 'currency',
                      currency: 'RON'
                    })}
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart functionality will be implemented later
                }}
              >
                Adaugă în coș
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 