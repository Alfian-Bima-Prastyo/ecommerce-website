"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
};

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/wishlist")
        .then((r) => r.json())
        .then((data) => { setItems(data); setLoading(false); });
    }
  }, [status]);

  const handleRemove = async (productId: string) => {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/profile" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Profil</Link>
        <Link href="/profile/password" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Ganti Password</Link>
        <span className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">Wishlist</span>
        <Link href="/profile/reviews" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Review Saya</Link>
        <Link href="/orders" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Riwayat Pesanan</Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🤍</p>
          <p className="text-gray-500 mb-4">Wishlist masih kosong</p>
          <Link href="/products" className="text-black font-medium underline">Jelajahi produk</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <Link href={`/products/${item.productId}`} className="font-medium text-gray-800 hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}