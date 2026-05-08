"use client";

import Image from "next/image";
import { useState } from "react";
import { type ProductImageVariant } from "@/lib/productImages";

interface ProductGalleryProps {
  variants: ProductImageVariant[];
  productName: string;
  category: string;
}

export default function ProductGallery({
  variants,
  productName,
  category,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeVariant = variants[activeIndex];
  const hasRealImage =
    activeVariant.src && !activeVariant.src.includes("placeholder");
  const hasMultiple = variants.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square bg-secondary rounded-3xl relative overflow-hidden group">
        {hasRealImage ? (
          <Image
            src={activeVariant.src}
            alt={
              activeVariant.label
                ? `${productName} - ${activeVariant.label}`
                : productName
            }
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail only shown when there are multiple variants */}
      {hasMultiple && (
        <div className="flex gap-3 flex-wrap">
          {variants.map((variant, index) => {
            const isActive = index === activeIndex;
            const thumbHasImage =
              variant.src && !variant.src.includes("placeholder");

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={
                  variant.label
                    ? `Pilih varian ${variant.label}`
                    : `Gambar ${index + 1}`
                }
                className={`
                  relative w-28 h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                  ${
                    isActive
                      ? "border-foreground scale-[1.04] shadow-md"
                      : "border-border hover:border-foreground/40 hover:scale-[1.02]"
                  }
                  bg-secondary
                `}
              >
                {thumbHasImage ? (
                  <Image
                    src={variant.src}
                    alt={variant.label ?? `Varian ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-[10px]">
                      {index + 1}
                    </span>
                  </div>
                )}

                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-foreground/10 rounded-xl" />
                )}
              </button>
            );
          })}
        </div>
      )}


    </div>
  );
}