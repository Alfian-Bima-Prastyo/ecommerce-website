import ProductFilter from "@/components/ProductFilter";

async function getProducts() {
  const res = await fetch(
    "https://badboyblack-agentic-rag-customer-service-api.hf.space/products",
    { cache: "no-store" }
  );
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Koleksi
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              All Products
            </h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              {products.length} produk tersedia
            </p>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground text-sm mb-6 sm:hidden">
          {products.length} produk tersedia
        </p>
        <ProductFilter products={products} />
      </section>
    </main>
  );
}