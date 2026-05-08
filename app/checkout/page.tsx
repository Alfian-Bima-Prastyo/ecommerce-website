"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductImage } from "@/lib/productImages";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
  if (session?.user) {
    setForm((prev) => ({
      ...prev,
      name: session.user.name ?? prev.name,
      email: session.user.email ?? prev.email,
    }));
  }
}, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.address) {
      setError("Nama, email, dan alamat wajib diisi");
      return;
    }
    if (items.length === 0 && !loading) {
      setError("Keranjang masih kosong");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          note: form.note,
          items: items.map((i) => ({
            productId: i.product_id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            size: i.size,
            color: i.color,
          })),
          total: total(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan");
        return;
      }

      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch (e) {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <p className="text-muted-foreground text-sm mb-4">Keranjang kamu masih kosong</p>
        <Link
          href="/products"
          className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Mulai belanja →
        </Link>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Pembelian
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Checkout</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Form */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Informasi Pengiriman
            </h2>

            {!session && (
              <div className="border border-border rounded-2xl px-5 py-4 text-sm text-muted-foreground mb-8">
                Checkout sebagai guest.{" "}
                <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
                  Login
                </Link>{" "}
                untuk simpan riwayat pesanan.
              </div>
            )}

            <div className="space-y-5">
              {[
                { name: "name", label: "Nama Lengkap", type: "text", placeholder: "John Doe" },
                { name: "email", label: "Email", type: "email", placeholder: "john@email.com" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-muted-foreground"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                  rows={3}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Catatan <span className="normal-case tracking-normal font-normal">(opsional)</span>
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Catatan untuk penjual..."
                  rows={2}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-5">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 bg-foreground text-background py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-5 mb-8">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex justify-between items-start"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={getProductImage(item.product_id)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-snug line-clamp-1">{item.name}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {item.size} / {item.color} × {item.qty}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-sm whitespace-nowrap ml-4">
                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="text-2xl font-bold tracking-tight">
                  Rp {total().toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}