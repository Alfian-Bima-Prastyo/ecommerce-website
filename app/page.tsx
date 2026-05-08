import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getProductImage } from "@/lib/productImages";


async function getFeaturedProducts() {
  const res = await fetch(
    "https://badboyblack-agentic-rag-customer-service-api.hf.space/products",
    { cache: "no-store" }
  );
  return res.json();
}

function ProductGridSkeleton() {
  return (
    <section className="max-w-[1800px] mx-auto px-8 py-16 sm:py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="h-8 w-48 bg-secondary rounded animate-pulse" />
          <div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
              <div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  const featured = products.slice(0, 6);

  return (
    <section className="max-w-[1800px] mx-auto px-8 py-16 sm:py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="mt-2 text-muted-foreground">
            Pilihan terbaik untuk kamu
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((product: any) => {
          const imageSrc = getProductImage(product.product_id);
          const hasImage = imageSrc !== "/images/placeholder.png";

          return (
            <Link
              key={product.product_id}
              href={`/products/${product.product_id}`}
              className="group"
            >
              <div className="aspect-square bg-secondary rounded-2xl mb-4 overflow-hidden relative group-hover:opacity-90 transition-opacity">
                {hasImage ? (
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                    {product.name}
                  </h3>

                  <span className="font-semibold text-sm whitespace-nowrap">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs">
                  {product.seller}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="w-full pt-6 pb-0 sm:pt-6 sm:pb-0">
        <div className="max-w-[1800px] mx-auto px-8">

          <div className="relative w-full aspect-[16/6.5] overflow-hidden rounded-3xl">

            <Image
              src="/img/hero.png"
              alt="Hero fashion"
              fill
              priority
              className="object-cover object-[center_65%]"
            />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">

              <div className="px-12 max-w-2xl font-sans">

                {/* Label */}
                <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 drop-shadow-sm">
                  NEW COLLECTION 2025
                </p>

                {/* Title */}
                <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-8 text-black drop-shadow-md">
                  Fashion <br /> for Everyone
                </h1>

                {/* Buttons */}
                <div className="flex gap-4 flex-wrap">

                  <Link
                    href="/products"
                    className="font-sans bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Shop Now
                  </Link>

                  <Link
                    href="/vouchers"
                    className="font-sans border border-border text-foreground px-8 py-3 rounded-full text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Lihat Voucher
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURED */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* COLLECTIONS */}
      {/* <section className="max-w-[1800px] mx-auto px-8 py-16 sm:py-24"> */}
      <section className="max-w-[1800px] mx-auto px-8 pt-0 pb-8 sm:pt-6 sm:pb-0">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Collections
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pilih kategori sesuai gaya kamu
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Collection 1 */}
          <div className="relative group overflow-hidden rounded-3xl">
            <Image
              src="/img/collections_1.png"
              alt="Style & Fashion"
              width={900}
              height={600}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-semibold">Style & Fashion</h3>
              <p className="text-sm opacity-80">
                Temukan gaya fashion terbaik kamu
              </p>
            </div>
          </div>

          {/* Collection 2 */}
          <div className="relative group overflow-hidden rounded-3xl">
            <Image
              src="/img/collections_2.png"
              alt="Lifestyle & Perks"
              width={900}
              height={600}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-semibold">Lifestyle & Essentials</h3>
              <p className="text-sm opacity-80">
                The most stylish accessories out there
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      {/* <section className="border-t border-border">
        <div className="max-w-[1800px] mx-auto px-8 py-24">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div>

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                AI Powered
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Customer Service <br /> yang Cerdas
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-8">
                Didukung Agentic RAG dengan 5 agent spesialis yang bekerja bersama
                untuk menjawab pertanyaan kamu secara akurat dan real-time, 24/7.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "FAQ Agent",
                  "Product Agent",
                  "Order Agent",
                  "Promo Agent",
                  "Escalation Agent"
                ].map((agent) => (
                  <span
                    key={agent}
                    className="bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {agent}
                  </span>
                ))}
              </div>

            </div>

            <div className="bg-secondary border border-border rounded-3xl aspect-square flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                AI Assistant
              </p>
            </div>

          </div>

        </div>
      </section> */}

    </main>
  );
}