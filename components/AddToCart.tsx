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
  const { addItem } = useCartStore();

  const colors = selectedSize
    ? Object.keys(product.stock[selectedSize])
    : [...new Set(sizes.flatMap((s) => Object.keys(product.stock[s])))];

  const stock =
    selectedSize && selectedColor
      ? product.stock[selectedSize][selectedColor]
      : null;

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
    if (!session) { router.push("/login"); return; }
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
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Ukuran
        </p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setSelectedColor(""); }}
              className={`border px-4 py-2 rounded-full text-sm transition-colors ${
                selectedSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Warna
        </p>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`border px-4 py-2 rounded-full text-sm transition-colors ${
                selectedColor === color
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Info */}
      {stock !== null && (
        <p className={`text-xs mb-4 ${stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {stock > 0 ? `Stok tersedia: ${stock} pcs` : "Stok habis"}
        </p>
      )}

      {(!selectedSize || !selectedColor) && (
        <p className="text-xs text-muted-foreground mb-4">
          Pilih ukuran dan warna terlebih dahulu
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleAdd}
          disabled={!selectedSize || !selectedColor || stock === 0}
          className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all ${
            added
              ? "bg-green-600 text-white"
              : !selectedSize || !selectedColor || stock === 0
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-foreground text-background hover:opacity-90"
          }`}
        >
          {added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
        </button>

        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title={
            session
              ? wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"
              : "Login untuk wishlist"
          }
        className={`border px-4 py-3 rounded-full transition-colors text-base ${
          wishlisted
            ? "border-red-500 text-red-500"
            : "border-border text-muted-foreground hover:border-red-400 hover:text-red-400"
        }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}