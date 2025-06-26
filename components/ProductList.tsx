import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";
import { ProductWithVariants } from "@/lib/types";

async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    return await prisma.product.findMany({
      include: {
        colorVariants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductList() {
  const products = await getProducts();

  if (!products.length) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Our Collection</h2>
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-6 pb-12">
      <div className="text-center space-y-2 mb-20 font-poppins relative pb-6">
        <p className="text-sm uppercase tracking-wider text-black font-medium">
          CHOOSE THE RIGHT FRAGRANCE FOR YOU
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">Featured products</h2>
        <div className="absolute -bottom-[0.2rem] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-[#FFD66C]"></div>
      </div>

      {/* Mobile View - Stack */}
      <div className="flex flex-col gap-8 md:hidden">
        {products.map((product) => (
          <div
            key={`${product.id}-${product.name}`}
            className="flex justify-center"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop View - Carousel */}
      <div className="hidden md:block">
        <ProductCarousel products={products} />
      </div>
      {/* About Us Section */}
      <div className="mt-24 mb-12">
        <div className="text-center space-y-2 mb-12 font-poppins relative pb-6">
          <p className="text-sm uppercase tracking-wider text-black font-medium">
            DESPRE NOI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Povestea SmartHomeMall
          </h2>
          <div className="absolute -bottom-[0.2rem] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-[#FFD66C]"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[300px] rounded-[50px] overflow-hidden flex items-center justify-center">
            <Image
              src="/parfumepng.png"
              alt="SmartHomeMall"
              width={400}
              height={400}
              className="rounded-[50px]"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-600">
              La SmartHomeMall, credem că fiecare parfum spune o poveste unică.
              Suntem dedicați artei parfumeriei, creând arome care nu doar miros
              extraordinar, ci evocă și emoții și amintiri profunde.
            </p>
            <p className="text-lg leading-relaxed text-gray-600">
              Cu o experiență îndelungată în domeniul parfumeriei și o pasiune
              pentru calitate, echipa noastră se străduiește să aducă cele mai
              rafinate și distinctive arome pentru clienții noștri.
            </p>
            <p className="text-lg leading-relaxed text-gray-600">
              Fiecare parfum SmartHomeMall este creat cu ingrediente atent
              selecționate și testate pentru a asigura cea mai înaltă calitate
              și longevitate a aromei.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-36 mb-12">
        <div className="text-center space-y-2 mb-12 font-poppins relative pb-6">
          <p className="text-sm uppercase tracking-wider text-black font-medium">
            CATEGORIILE NOASTRE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Descoperă toate categoriile
          </h2>
          <div className="absolute -bottom-[0.2rem] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-[#FFD66C]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Video Door Phone Category Card */}
          <Link href="/products?category=Video%20Door%20Phone" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/mencol.webp"
                alt="Video Door Phone"
                width={500}
                height={500}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">
                  Video Door Phone
                </h3>
              </div>
            </div>
          </Link>

          {/* Smart Lighting Category Card */}
          <Link href="/products?category=Smart%20Lighting" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/womencol.webp"
                alt="Smart Lighting"
                width={500}
                height={500}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">
                  Smart Lighting
                </h3>
              </div>
            </div>
          </Link>

          {/* Smart Security Category Card */}
          <Link href="/products?category=Smart%20Security" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/freshcol.webp"
                alt="Smart Security"
                width={500}
                height={500}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">
                  Smart Security
                </h3>
              </div>
            </div>
          </Link>

          {/* Sale Category Card */}
          <Link href="/products?category=Sale" className="group">
            <div className="relative h-[400px] rounded-[30px] overflow-hidden">
              <Image
                src="/salescol.webp"
                alt="Sale"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Reduceri</h3>
                <p className="text-sm mt-1">Oferte speciale</p>
              </div>
            </div>
          </Link>

          {/* Smart Home Automation Category Card */}
          <Link href="/products?category=Smart%20Home%20Automation" className="group">
            <div className="relative h-[400px] rounded-[30px] overflow-hidden">
              <Image
                src="/unisexcol.webp"
                alt="Smart Home Automation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Smart Home Automation</h3>
                <p className="text-sm mt-1">Automatizare completă</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center text-lg font-medium hover:text-gray-700 transition-colors"
          >
            Vezi toate produsele
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
