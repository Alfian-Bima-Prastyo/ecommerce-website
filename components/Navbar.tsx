import Link from "next/link";
import NavbarClient from "@/components/NavbarClient";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="text-lg font-bold tracking-tight">
            TokoOnline
          </Link>

          <NavbarClient />

        </div>
      </div>
    </nav>
  );
}