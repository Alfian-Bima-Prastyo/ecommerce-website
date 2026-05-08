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
    <main>
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Promo
          </p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Voucher Aktif
            </h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              {activeVouchers.length} voucher tersedia
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeVouchers.map((voucher: any) => {
            const sisa = voucher.quota - voucher.used;
            const persenTerpakai = Math.round((voucher.used / voucher.quota) * 100);

            return (
              <div
                key={voucher.code}
                className="border border-border rounded-2xl overflow-hidden bg-background"
              >
                {/* Top */}
                <div className="px-6 py-5" style={{ backgroundColor: "#D9CFC4", color: "#1a1a1a" }}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl tracking-tight">
                      {voucher.discount.type === "persen"
                        ? `${voucher.discount.value}% OFF`
                        : `Rp ${voucher.discount.value.toLocaleString("id-ID")}`}
                    </span>
                    {/* <span className="bg-background text-foreground text-xs font-bold px-3 py-1 rounded-full font-mono"> */}
                    <span className="text-xs font-bold px-3 py-1 rounded-full font-mono" style={{ backgroundColor: "#ffffff", color: "#1a1a1a" }}>
                      {voucher.code}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <p className="text-sm mb-4 leading-relaxed">{voucher.description}</p>

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-5">
                    <p>
                      Min. pembelian:{" "}
                      <span className="font-medium text-foreground">
                        Rp {voucher.min_purchase.toLocaleString("id-ID")}
                      </span>
                    </p>
                    <p>
                      Berlaku hingga:{" "}
                      <span className="font-medium text-foreground">
                        {new Date(voucher.valid_until).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p>
                      Sisa kuota:{" "}
                      <span className="font-medium text-foreground">
                        {sisa} dari {voucher.quota}
                      </span>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-5">
                    <div className="bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-foreground h-1.5 rounded-full transition-all"
                        style={{ width: `${persenTerpakai}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {persenTerpakai}% kuota terpakai
                    </p>
                  </div>

                  <CopyButton code={voucher.code} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}