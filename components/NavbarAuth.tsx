"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-16 h-4 bg-secondary rounded animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-5">
        <Link
          href="/profile"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {session.user?.name ?? session.user?.email}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <Link
        href="/login"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-foreground text-background text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Register
      </Link>
    </div>
  );
}