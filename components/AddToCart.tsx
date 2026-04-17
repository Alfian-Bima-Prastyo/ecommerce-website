"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  product: {
    product_id: string;
    name: string;
    price: number;
    stock: Record<string, Record<string, number>>;
  };
};

export default function AddToCart({ product }: Props) {
  const sizes = Object.keys(product.stock);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const colors = selectedSize
    ? Object.keys(product.stock[selectedSize])
    : [...new Set(sizes.flatMap((s) => Object.keys(product.stock[s])))];

  const stock =
    selectedSize && selectedColor
      ? product.stock[selectedSize][selectedColor]
      : null;

  const { addItem } = useCartStore();

  // Cek apakah produk sudah di wishlist
  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlisted(data.some((i: any) => i.productId === product.product_id));
        }
      });
  }, [session, product.product_id]);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setWishlistLoading(true);

    if (wishlisted) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.product_id }),
      });
      setWishlisted(false);
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.product_id,
          name: product.name,
          price: product.price,
          image: null,
        }),
      });
      setWishlisted(true);
    }

    setWishlistLoading(false);
  };

  return (
    <div>
      {/* Size */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Ukuran</h3>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setSelectedColor(""); }}
              className={`border px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSize === size
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Warna</h3>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`border px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedColor === color
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Info */}
      {stock !== null && (
        <p className={`text-sm mb-4 ${stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {stock > 0 ? `Stok tersedia: ${stock} pcs` : "Stok habis"}
        </p>
      )}

      {(!selectedSize || !selectedColor) && (
        <p className="text-xs text-gray-400 mb-4">Pilih ukuran dan warna terlebih dahulu</p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={!selectedSize || !selectedColor || stock === 0}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            added
              ? "bg-green-500 text-white"
              : !selectedSize || !selectedColor || stock === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
        </button>

        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title={session ? (wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist") : "Login untuk wishlist"}
          className={`border px-4 py-3 rounded-xl transition-colors text-lg ${
            wishlisted
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}