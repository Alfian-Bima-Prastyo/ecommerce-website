"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-8 bg-gray-100 rounded animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
        >
          👤 {session.user?.name ?? session.user?.email}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-gray-600 hover:text-blue-600 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Daftar
      </Link>
    </div>
  );
}