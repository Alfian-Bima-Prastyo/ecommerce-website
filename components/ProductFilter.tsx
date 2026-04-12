"use client";

import Link from "next/link";
import { useState } from "react";

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
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white flex-1 min-w-48 focus:outline-none focus:border-blue-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white"
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
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white"
        >
          <option value="">Urutkan</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      {/* Hasil */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} produk ditemukan</p>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.product_id}
              href={`/products/${product.product_id}`}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm text-center px-2">
                  {product.category}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{product.seller}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                <span className="text-yellow-500 text-sm">⭐ {product.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}