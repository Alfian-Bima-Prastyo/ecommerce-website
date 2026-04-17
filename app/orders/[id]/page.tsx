import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Pesanan tidak ditemukan</h1>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Kembali ke Home
        </Link>
      </div>
    );
  }

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-gray-500 text-sm">
          ID Pesanan:{" "}
          <span className="font-mono font-medium text-gray-700">{order.id}</span>
        </p>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Detail Pesanan</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
            {statusLabel[order.status]}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex gap-2">
            <span className="text-gray-500 min-w-32">Nama</span>
            <span className="text-gray-800">{order.guestName ?? "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 min-w-32">Email</span>
            <span className="text-gray-800">{order.guestEmail ?? "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 min-w-32">Alamat</span>
            <span className="text-gray-800">{order.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 min-w-32">Tanggal</span>
            <span className="text-gray-800">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-500 text-xs">
                  {item.size} / {item.color} × {item.qty}
                </p>
              </div>
              <p className="font-medium text-gray-800 ml-4 whitespace-nowrap">
                Rp {(item.price * item.qty).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-blue-600 text-xl">
            Rp {order.total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/products"
          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Lanjut Belanja
        </Link>
        <Link
          href="/orders"
          className="flex-1 border border-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Riwayat Pesanan
        </Link>
      </div>
    </div>
  );
}