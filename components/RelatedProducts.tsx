"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { ProductWithVariants } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";

export default function RelatedProducts({
  products,
  currentProductId,
  category,
}: {
  products: ProductWithVariants[];
  currentProductId: string;
  category: string;
}) {
  // Filter out the current product
  const filteredProducts = products.filter(
    (product) => product.id !== currentProductId
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: filteredProducts.length > 4,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!filteredProducts.length) return null;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="py-12">
          <div className="text-center space-y-2 mb-12 font-poppins relative pb-6">
            <p className="text-sm uppercase tracking-wider text-black font-medium">
              DESCOPERIȚI MAI MULTE PRODUSE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Produse similare din categoria {category}
            </h2>
            <div className="absolute -bottom-[0.2rem] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-[#29b4b9]"></div>
          </div>

          {/* Mobile View - Stack */}
          <div className="flex flex-col gap-6 mt-8 md:hidden">
            {filteredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="w-full max-w-sm mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Desktop View - Carousel */}
          <div className="hidden md:block relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -mx-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] px-4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#29b4b9] hover:bg-[#4adde4] transition-colors duration-300 rounded-2xl border-none z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#29b4b9] hover:bg-[#4adde4] transition-colors duration-300 rounded-2xl border-none z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
