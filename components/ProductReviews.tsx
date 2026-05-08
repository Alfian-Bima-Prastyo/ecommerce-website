"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
};

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(0);

  const fetchReviews = () => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); });
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { setError("Pilih rating dulu"); return; }
    setSaving(true);
    setSuccess("");
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating: form.rating, comment: form.comment }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setSuccess("Review berhasil disimpan!");
      setForm({ rating: 0, comment: "" });
      fetchReviews();
    } else {
      setError(data.error ?? "Gagal menyimpan review");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-8">
        {avgRating && (
          <span className="text-sm text-muted-foreground">
            ★ {avgRating} · {reviews.length} review
          </span>
        )}
      </div>

      {/* Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-6 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Tulis Review
          </p>

          {/* Star Rating */}
          <div className="flex gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setForm({ ...form, rating: star })}
                className="text-xl transition-transform hover:scale-110 leading-none"
              >
                <span className={star <= (hovered || form.rating) ? "text-yellow-500" : "text-muted-foreground"}>
                  ★
                </span>
              </button>
            ))}
            {form.rating > 0 && (
              <span className="ml-1 text-xs text-muted-foreground self-center">
                {form.rating}/5
              </span>
            )}
          </div>

          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Ceritakan pengalaman kamu dengan produk ini..."
            rows={3}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none mb-4 placeholder:text-muted-foreground"
          />

          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {saving ? "Menyimpan..." : "Kirim Review"}
          </button>
        </form>
      ) : (
        <div className="border border-border rounded-2xl p-6 mb-10 text-center">
          <p className="text-muted-foreground text-sm">
            <Link
              href="/login"
              className="text-foreground font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Login
            </Link>{" "}
            untuk menulis review
          </p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-5">
              <div className="h-4 w-24 bg-secondary rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-secondary rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada review untuk produk ini.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">{review.user.name ?? "Pengguna"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-yellow-500 text-sm tracking-wider">
                  {"★".repeat(review.rating)}
                  <span className="text-muted-foreground">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}