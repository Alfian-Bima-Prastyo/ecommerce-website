"use client";

import CartDrawer from "@/components/CartDrawer";
import NavbarAuth from "@/components/NavbarAuth";
import Link from "next/link";

export default function NavbarClient() {
  return (
    <div className="flex items-center gap-6">
      <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Products
      </Link>
      <Link href="/vouchers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Vouchers
      </Link>
      <NavbarAuth />
      <CartDrawer />
    </div>
  );
}