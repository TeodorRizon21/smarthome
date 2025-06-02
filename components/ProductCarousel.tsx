"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { ProductWithVariants } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";

export default function ProductCarousel({
  products,
}: {
  products: ProductWithVariants[];
}) {
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-[1400px] mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 py-4">
          {products.map((product) => (
            <div
              key={`${product.id}-${product.name}`}
              className="flex-none w-[calc(100%-1rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] px-2"
            >
              <div className="flex justify-center">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition-all duration-300 rounded-full border shadow-lg z-10 ${
          !prevBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition-all duration-300 rounded-full border shadow-lg z-10 ${
          !nextBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </Button>
    </div>
  );
}
