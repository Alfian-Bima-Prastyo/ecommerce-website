"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Review = {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export default function ReviewsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/reviews/mine")
        .then((r) => r.json())
        .then((data) => { setReviews(data); setLoading(false); });
    }
  }, [status]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Saya</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/profile" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Profil</Link>
        <Link href="/profile/password" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Ganti Password</Link>
        <Link href="/profile/wishlist" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Wishlist</Link>
        <span className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">Review Saya</span>
        <Link href="/orders" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Riwayat Pesanan</Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-gray-500 mb-4">Belum ada review</p>
          <Link href="/products" className="text-black font-medium underline">Belanja dan beri review</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/products/${review.productId}`} className="font-medium text-gray-800 hover:underline text-sm">
                  Produk #{review.productId.slice(0, 8)}
                </Link>
                <span className="text-yellow-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}