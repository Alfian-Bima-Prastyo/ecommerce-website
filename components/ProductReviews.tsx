"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
    <div className="mt-16">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Review & Rating
        {avgRating && (
          <span className="ml-3 text-yellow-500 text-base font-normal">
            ⭐ {avgRating} ({reviews.length} review)
          </span>
        )}
      </h2>

      {/* Form Review */}
      {session ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">Tulis Review</h3>

          {/* Star Rating */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setForm({ ...form, rating: star })}
                className="text-2xl transition-transform hover:scale-110"
              >
                {star <= (hovered || form.rating) ? "⭐" : "☆"}
              </button>
            ))}
            {form.rating > 0 && (
              <span className="ml-2 text-sm text-gray-500 self-center">{form.rating}/5</span>
            )}
          </div>

          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Ceritakan pengalaman kamu dengan produk ini..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none mb-4"
          />

          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Kirim Review"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-500 text-sm">
            <a href="/login" className="text-black font-medium underline">Login</a> untuk menulis review
          </p>
        </div>
      )}

      {/* List Review */}
      {loading ? (
        <p className="text-gray-400 text-sm">Memuat review...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada review untuk produk ini.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{review.user.name ?? "Pengguna"}</p>
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
              </div>
              {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}