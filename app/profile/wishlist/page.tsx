"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileNav from "@/components/ProfileNav";

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
      </div>
    );
  }

  return (
    <main>
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Akun
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Profil Saya</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProfileNav />

        {items.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-sm mb-4">Wishlist masih kosong</p>
            <Link
              href="/products"
              className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Jelajahi produk →
            </Link>
          </div>
        ) : (
          <div className="max-w-lg space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-2xl p-5 flex justify-between items-center group"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex-shrink-0" />
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium text-sm hover:underline underline-offset-4"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}