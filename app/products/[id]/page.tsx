import Link from "next/link";
import ChatContext from "@/components/ChatContext";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import AddToCart from "@/components/AddToCart";
import ProductReviews from "@/components/ProductReviews";
import ProductGallery from "@/components/ProductGallery";
import { getProductVariants } from "@/lib/productImages";

async function getProduct(id: string) {
  const res = await fetch(
    "https://badboyblack-agentic-rag-customer-service-api.hf.space/products",
    { cache: "no-store" }
  );
  const products = await res.json();
  return products.find((p: any) => p.product_id === id);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <p className="text-muted-foreground text-sm mb-4">Produk tidak ditemukan</p>
        <Link
          href="/products"
          className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          ← Kembali ke katalog
        </Link>
      </main>
    );
  }

  const variants = getProductVariants(product.product_id);

  return (
    <main>
      <ChatContext product={product} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-12">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery — main image + thumbnails */}
          <ProductGallery
            variants={variants}
            productName={product.name}
            category={product.category}
          />

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
              {product.seller}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              {/* <span className="text-sm text-muted-foreground">⭐ {product.rating}</span> */}
              {/* <span className="text-border">|</span> */}
              <span className="text-xs text-muted-foreground font-mono">
                {product.product_id}
              </span>
            </div>

            <p className="text-3xl font-bold tracking-tight mb-8">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            {/* Specs */}
            <div className="border-t border-border pt-6 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Spesifikasi
              </p>
              <div className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex gap-4 text-sm">
                    <span className="text-muted-foreground capitalize min-w-32">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add To Cart */}
            <AddToCart product={product} />
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT — AI */}
            <div>
              <h2 className="text-lg font-semibold mb-6">
                Tanya AI
              </h2>
              <SuggestedQuestions
                productName={product.name}
                productId={product.product_id}
              />
            </div>

            {/* RIGHT — REVIEWS */}
            <div>
              <h2 className="text-lg font-semibold mb-6">
                Reviews
              </h2>
              <ProductReviews productId={product.product_id} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}