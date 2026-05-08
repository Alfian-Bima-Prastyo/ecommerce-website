import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await getOrders(session.user.id);

  return (
    <main>
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Akun
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Riwayat Pesanan
            </h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              {orders.length} pesanan
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {orders.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-sm mb-4">Belum ada pesanan</p>
            <Link
              href="/products"
              className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Mulai belanja →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block border border-border rounded-2xl p-6 hover:bg-secondary transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">
                      {order.id.slice(0, 16)}...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {statusLabel[order.status]}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm line-clamp-1">
                      {item.name}{" "}
                      <span className="text-muted-foreground">
                        {item.size}/{item.color} × {item.qty}
                      </span>
                    </p>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {order.items.length} produk
                  </span>
                  <span className="font-bold text-sm">
                    Rp {order.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}