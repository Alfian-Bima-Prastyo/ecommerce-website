import Link from "next/link";

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

  const sizes = Object.keys(product.stock);
  const colors = [...new Set(sizes.flatMap((size) => Object.keys(product.stock[size])))] as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
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

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Ukuran</h3>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:border-blue-500 cursor-pointer"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Warna</h3>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <span
                  key={color}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:border-blue-500 cursor-pointer"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Stok per Varian</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              {sizes.map((size) => (
                <div key={size} className="mb-2">
                  <span className="font-medium text-gray-700">Ukuran {size}:</span>
                  <div className="flex gap-4 mt-1 ml-4">
                    {Object.entries(product.stock[size]).map(([color, qty]) => (
                      <span key={color} className="text-gray-600">
                        {color}:{" "}
                        <span className={Number(qty) > 0 ? "text-green-600 font-medium" : "text-red-500"}>
                          {qty as number} pcs
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Tambah ke Keranjang
            </button>
            <button className="border border-gray-300 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              🤍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}