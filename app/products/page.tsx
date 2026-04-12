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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        <p className="text-gray-500 mt-1">{products.length} produk tersedia</p>
      </div>
      <ProductFilter products={products} />
    </div>
  );
}