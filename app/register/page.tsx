"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-secondary p-12">
        <Link href="/" className="text-lg font-bold tracking-tight">
          TokoOnline
        </Link>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Bergabung sekarang
          </p>
          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Buat akun dan nikmati <br /> pengalaman belanja <br /> yang lebih baik
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 TokoOnline</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Akun
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Daftar</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", label: "Nama", type: "text", placeholder: "John Doe" },
              { name: "email", label: "Email", type: "email", placeholder: "john@email.com" },
              { name: "password", label: "Password", type: "password", placeholder: "" },
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
                  required={field.name !== "name"}
                  placeholder={field.placeholder}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all placeholder:text-muted-foreground"
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}