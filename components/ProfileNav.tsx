"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Profil", href: "/profile" },
  { label: "Ganti Password", href: "/profile/password" },
  { label: "Wishlist", href: "/profile/wishlist" },
  { label: "Review Saya", href: "/profile/reviews" },
  { label: "Pesanan", href: "/orders" },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 flex-wrap mb-10">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}