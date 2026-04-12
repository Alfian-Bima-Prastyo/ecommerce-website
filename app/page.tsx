import Link from "next/link";

async function getFeaturedProducts() {
  const res = await fetch(
    "https://badboyblack-agentic-rag-customer-service-api.hf.space/products",
    { cache: "no-store" }
  );
  return res.json();
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Belanja Fashion Terlengkap
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Temukan produk fashion terbaik dengan harga terjangkau
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* Agentic RAG Section */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            AI POWERED
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Didukung Agentic RAG Customer Service
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Chatbot AI kami menggunakan 5 agent cerdas — FAQ, Produk, Order,
            Promo, dan Eskalasi — untuk menjawab pertanyaanmu secara akurat dan
            real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["FAQ Agent", "Product Agent", "Order Agent", "Promo Agent", "Escalation Agent"].map(
              (agent) => (
                <span
                  key={agent}
                  className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm"
                >
                  {agent}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Lihat semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product: any) => (
            <Link
              key={product.product_id}
              href={`/products/${product.product_id}`}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Placeholder Image */}
              <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm">{product.category}</span>
              </div>

              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{product.seller}</p>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                <span className="text-yellow-500 text-sm">
                  ⭐ {product.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Voucher CTA */}
      <section className="bg-orange-50 border-t border-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Hemat Lebih Banyak dengan Voucher
          </h2>
          <p className="text-gray-600 mb-6">
            Tersedia 20+ voucher aktif dengan diskon hingga 50%
          </p>
          <Link
            href="/vouchers"
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Lihat Voucher
          </Link>
        </div>
      </section>
    </div>
  );
}