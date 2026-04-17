"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          setForm({ name: data.name ?? "", address: data.address ?? "" });
          setLoading(false);
        });
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      setSuccess("Profil berhasil disimpan");
    } else {
      setError("Gagal menyimpan profil");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h1>
      <p className="text-gray-500 mb-8">{session?.user?.email}</p>

      {/* Nav */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <span className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">Profil</span>
        <Link href="/profile/password" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Ganti Password</Link>
        <Link href="/profile/wishlist" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Wishlist</Link>
        <Link href="/profile/reviews" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Review Saya</Link>
        <Link href="/orders" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Riwayat Pesanan</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Default</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
          />
        </div>
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}