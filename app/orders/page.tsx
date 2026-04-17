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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const orders = await getOrders(session.user.id);

  const statusLabel: Record<string, string> = {
    PENDING: "Menunggu Konfirmasi",
    PROCESSING: "Sedang Diproses",
    SHIPPED: "Sedang Dikirim",
    DELIVERED: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="mb-4">Belum ada pesanan</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-500 mb-1">{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                {order.items.map((item) => (
                  <p key={item.id} className="line-clamp-1">
                    {item.name} ({item.size}/{item.color}) × {item.qty}
                  </p>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {order.items.length} produk
                </span>
                <span className="font-bold text-blue-600">
                  Rp {order.total.toLocaleString("id-ID")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}