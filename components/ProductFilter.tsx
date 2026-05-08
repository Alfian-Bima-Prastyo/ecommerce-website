"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getProductImage } from "@/lib/productImages";

type Product = {
  product_id: string;
  name: string;
  price: number;
  rating: number;
  seller: string;
  category: string;
  stock: Record<string, Record<string, number>>;
};

  

export default function ProductFilter({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category ? p.category.includes(category) : true;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border rounded-full px-5 py-2.5 text-sm bg-background flex-1 min-w-48 focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-muted-foreground"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-border rounded-full px-5 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-foreground"
        >
          <option value="">Semua Kategori</option>
          <option value="kaos">Kaos</option>
          <option value="kemeja">Kemeja</option>
          <option value="celana">Celana</option>
          <option value="sepatu">Sepatu</option>
          <option value="aksesoris">Aksesoris</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-border rounded-full px-5 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-foreground"
        >
          <option value="">Urutkan</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-8 tracking-wide">
        {filtered.length} produk ditemukan
      </p>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-muted-foreground text-sm">Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => {
            const imageSrc = getProductImage(product.product_id); 
            const hasImage = imageSrc !== "/img/placeholder.png"; 

            return (
              <Link
                key={product.product_id}
                href={`/products/${product.product_id}`}
                className="group"
              >
              {/* Image */}
              
              <div className="aspect-square bg-secondary rounded-2xl mb-4 overflow-hidden group-hover:opacity-90 transition-opacity relative"> {/* tambah relative */}
                  {hasImage ? (
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                    {product.name}
                  </h3>
                  <span className="font-semibold text-sm whitespace-nowrap">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-xs">{product.seller}</p>
                  {/* <p className="text-muted-foreground text-xs">⭐ {product.rating}</p> */}
                </div>
              </div>
            </Link>
            );  
          })}  
        </div>
      )}
    </div>
  );
}