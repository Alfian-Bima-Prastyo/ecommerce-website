import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            TokoOnline
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Produk
            </Link>
            <Link href="/vouchers" className="text-gray-600 hover:text-blue-600 transition-colors">
              Voucher
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Daftar
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}