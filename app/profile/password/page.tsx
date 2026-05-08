"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";

const fields = [
  { name: "currentPassword", label: "Password Lama" },
  { name: "newPassword", label: "Password Baru" },
  { name: "confirmPassword", label: "Konfirmasi Password Baru" },
];

export default function PasswordPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
    <main>
      {/* Header */}
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

        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            Ganti Password
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  {field.label}
                </label>
                <input
                  type="password"
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                />
              </div>
            ))}

            {success && <p className="text-green-600 text-sm">{success}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-foreground text-background py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}