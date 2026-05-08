import Link from "next/link";
import Image from "next/image";
import { getProductImage } from "@/lib/productImages";
import { prisma } from "@/lib/prisma";

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Konfirmasi",
  PROCESSING: "Sedang Diproses",
  SHIPPED: "Sedang Dikirim",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const statusDot: Record<string, string> = {
  PENDING: "bg-yellow-400",
  PROCESSING: "bg-blue-400",
  SHIPPED: "bg-purple-400",
  DELIVERED: "bg-green-400",
  CANCELLED: "bg-red-400",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <p className="text-muted-foreground text-sm mb-4">Pesanan tidak ditemukan</p>
        <Link
          href="/"
          className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          ← Kembali ke Home
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
            Pesanan
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Pesanan Berhasil
            </h1>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`} />
              <span className="text-sm text-muted-foreground">
                {statusLabel[order.status]}
              </span>
            </div>
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-3">
            {order.id}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Order Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Informasi Pengiriman
            </p>
            <div className="space-y-4">
              {[
                { label: "Nama", value: order.guestName ?? "—" },
                { label: "Email", value: order.guestEmail ?? "—" },
                { label: "Alamat", value: order.address },
                {
                  label: "Tanggal",
                  value: new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ].map((row) => (
                <div key={row.label} className="flex gap-4 text-sm">
                  <span className="text-muted-foreground min-w-24">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-12">
              <Link
                href="/products"
                className="flex-1 bg-foreground text-background text-center py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Lanjut Belanja
              </Link>
              <Link
                href="/orders"
                className="flex-1 border border-border text-center py-3 rounded-full text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Riwayat Pesanan
              </Link>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Item Pesanan
            </p>

            <div className="space-y-5 mb-8">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={getProductImage(item.productId)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-snug">{item.name}</p>
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

            <div className="border-t border-border pt-6 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}