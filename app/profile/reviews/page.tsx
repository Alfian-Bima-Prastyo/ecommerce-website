"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileNav from "@/components/ProfileNav";

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
      </div>
    );
  }

  return (
    <main>
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

        {reviews.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-sm mb-4">Belum ada review</p>
            <Link
              href="/products"
              className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Belanja dan beri review →
            </Link>
          </div>
        ) : (
          <div className="max-w-lg space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <Link
                    href={`/products/${review.productId}`}
                    className="text-sm font-medium hover:underline underline-offset-4"
                  >
                    Produk #{review.productId.slice(0, 8)}
                  </Link>
                  <span className="text-yellow-500 text-sm tracking-wider">
                    {"★".repeat(review.rating)}
                    <span className="text-muted-foreground">{"★".repeat(5 - review.rating)}</span>
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}