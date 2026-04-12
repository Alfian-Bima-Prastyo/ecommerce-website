import CopyButton from "@/components/CopyButton";

async function getVouchers() {
  const res = await fetch(
    "https://badboyblack-agentic-rag-customer-service-api.hf.space/vouchers",
    { cache: "no-store" }
  );
  return res.json();
}

export default async function VouchersPage() {
  const vouchers = await getVouchers();
  const activeVouchers = vouchers.filter((v: any) => v.is_active);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Voucher Aktif</h1>
        <p className="text-gray-500 mt-1">{activeVouchers.length} voucher tersedia</p>
      </div>

      {/* Voucher Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeVouchers.map((voucher: any) => {
          const sisa = voucher.quota - voucher.used;
          const persenTerpakai = Math.round((voucher.used / voucher.quota) * 100);

          return (
            <div
              key={voucher.code}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Header Voucher */}
              <div className="bg-orange-500 px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-xl">
                    {voucher.discount.type === "persen"
                      ? `${voucher.discount.value}% OFF`
                      : `Rp ${voucher.discount.value.toLocaleString("id-ID")}`}
                  </span>
                  <span className="bg-white text-orange-500 text-xs font-bold px-2 py-1 rounded">
                    {voucher.code}
                  </span>
                </div>
              </div>

              {/* Voucher Body */}
              <div className="px-6 py-4">
                <p className="text-gray-700 text-sm mb-3">{voucher.description}</p>

                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <p>
                    Min. pembelian:{" "}
                    <span className="font-medium text-gray-700">
                      Rp {voucher.min_purchase.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p>
                    Berlaku hingga:{" "}
                    <span className="font-medium text-gray-700">
                      {new Date(voucher.valid_until).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p>
                    Sisa kuota:{" "}
                    <span className="font-medium text-gray-700">
                      {sisa} dari {voucher.quota}
                    </span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${persenTerpakai}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{persenTerpakai}% kuota terpakai</p>
                </div>

                {/* Copy Button */}
                <CopyButton code={voucher.code} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
