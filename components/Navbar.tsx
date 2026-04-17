import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import NavbarAuth from "@/components/NavbarAuth";

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
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
              Profile
            </Link>
            <NavbarAuth />
            <CartDrawer />
          </div>

        </div>
      </div>
    </nav>
  );
}