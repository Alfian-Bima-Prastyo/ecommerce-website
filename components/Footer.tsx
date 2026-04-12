import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">TokoOnline</h3>
            <p className="text-sm leading-relaxed">
              Toko fashion terlengkap dengan AI Customer Service berbasis
              Agentic RAG.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/vouchers" className="hover:text-white transition-colors">
                  Voucher
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Info */}
          <div>
            <h4 className="text-white font-semibold mb-3">AI Customer Service</h4>
            <ul className="space-y-2 text-sm">
              {["FAQ Agent", "Product Agent", "Order Agent", "Promo Agent", "Escalation Agent"].map(
                (agent) => (
                  <li key={agent} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {agent}
                  </li>
                )
              )}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-sm text-center">
          <p>© 2026 TokoOnline. Powered by Agentic RAG.</p>
        </div>
      </div>
    </footer>
  );
}