"use client";

import { useCartStoreHydrated } from "@/store/cartStore";
import { useState } from "react";
import Link from "next/link";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQty, total, hydrated } = useCartStoreHydrated();
  const totalItems = hydrated ? items.reduce((sum, i) => sum + i.qty, 0) : 0;
  console.log("hydrated:", hydrated, "items:", items);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="relative text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 border-l border-border transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Keranjang
            </p>
            {hydrated && totalItems > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">{totalItems} item</p>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        {/* <div className="overflow-y-auto px-6 py-6 flex-1 min-h-0"> */}
          {/* Items */}
        <div className="overflow-y-auto bg-white px-6 py-6" style={{ flex: "1 1 0", minHeight: 100 }}>
          {!hydrated ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-sm">Memuat...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-sm mb-4">Keranjang masih kosong</p>
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Lanjut belanja →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex gap-4"
                >
                  {/* <div className="bg-secondary rounded-xl w-16 h-16 flex-shrink-0" /> */}
                  <div className="rounded-xl w-16 h-16 flex-shrink-0" style={{ backgroundColor: "#e5e7eb" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? updateQty(item.product_id, item.size, item.color, item.qty - 1)
                            : removeItem(item.product_id, item.size, item.color)
                        }
                        className="w-6 h-6 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors text-sm flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() =>
                          updateQty(item.product_id, item.size, item.color, item.qty + 1)
                        }
                        className="w-6 h-6 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product_id, item.size, item.color)}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {hydrated && items.length > 0 && (
          <div className="px-6 py-5 border-t border-border bg-background flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="font-bold text-lg tracking-tight">
                Rp {total().toLocaleString("id-ID")}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full bg-foreground text-background text-center py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
