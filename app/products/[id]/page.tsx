import Link from "next/link";
import ChatContext from "@/components/ChatContext";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import AddToCart from "@/components/AddToCart";
import ProductReviews from "@/components/ProductReviews";

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
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Produk tidak ditemukan</h1>
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Inject Product Context to chatbot*/}
      <ChatContext product={product} />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/products" className="hover:text-blue-600">Produk</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Placeholder Image */}
        <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
          <span className="text-gray-400">{product.category}</span>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.seller}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-yellow-500">⭐ {product.rating}</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.product_id}
            </span>
          </div>

          <p className="text-3xl font-bold text-blue-600 mb-6">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          {/* Specification */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Spesifikasi</h3>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-sm">
                  <span className="text-gray-500 capitalize min-w-32">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-800">{value as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add To Cart */}
          <AddToCart product={product} />

          {/* Suggested Questions */}
          <SuggestedQuestions productName={product.name} productId={product.product_id} />

          {/* Reviews */}
          <ProductReviews productId={product.product_id} />
        </div>
      </div>
    </div>
  );
}