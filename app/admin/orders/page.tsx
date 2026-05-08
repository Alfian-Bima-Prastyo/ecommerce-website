"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string;
  status: string;
  total: number;
  address: string;
  createdAt: string;
  guestName: string | null;
  guestEmail: string | null;
  user: { name: string | null; email: string } | null;
  items: { id: string; name: string; qty: number; size: string; color: string; price: number }[];
};

const statusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    }
    setUpdating(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Order</h1>
          <p className="text-gray-500 mt-1">{orders.length} total order</p>
        </div>
        <a href="/admin" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          ← Dashboard
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-mono text-xs text-gray-400">{order.id.slice(0, 12)}...</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800">
                    {order.user?.name ?? order.guestName ?? "Guest"}
                    <span className="text-gray-400 font-normal text-sm ml-2">
                      {order.user?.email ?? order.guestEmail}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{order.address}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={order.status}
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                    disabled={updating === order.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                  >
                    {expanded === order.id ? "Tutup" : "Detail"}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-3">ITEM PESANAN</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} — {item.size}/{item.color} × {item.qty}
                        </span>
                        <span className="font-medium">Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}