"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function PasswordPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Password baru tidak cocok");
      return;
    }
    setSaving(true);
    setSuccess("");
    setError("");

    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setSuccess("Password berhasil diubah");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setError(data.error ?? "Gagal mengubah password");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/profile" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Profil</Link>
        <span className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">Ganti Password</span>
        <Link href="/profile/wishlist" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Wishlist</Link>
        <Link href="/profile/reviews" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Review Saya</Link>
        <Link href="/orders" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Riwayat Pesanan</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field === "currentPassword" ? "Password Lama" : field === "newPassword" ? "Password Baru" : "Konfirmasi Password Baru"}
            </label>
            <input
              type="password"
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
        ))}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Ubah Password"}
        </button>
      </form>
    </div>
  );
}