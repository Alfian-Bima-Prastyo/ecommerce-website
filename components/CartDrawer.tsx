"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQty, total } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative text-gray-600 hover:text-blue-600 transition-colors"
      >
        🛒
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">
            Keranjang {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🛒</p>
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex gap-4 bg-gray-50 rounded-xl p-3"
                >
                  {/* Placeholder image */}
                  <div className="bg-gray-200 rounded-lg w-16 h-16 flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                    IMG
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    {/* Qty control */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? updateQty(item.product_id, item.size, item.color, item.qty - 1)
                            : removeItem(item.product_id, item.size, item.color)
                        }
                        className="w-6 h-6 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.product_id, item.size, item.color, item.qty + 1)
                        }
                        className="w-6 h-6 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          removeItem(item.product_id, item.size, item.color)
                        }
                        className="ml-auto text-red-400 hover:text-red-600 text-xs"
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
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-gray-800 text-lg">
                Rp {total().toLocaleString("id-ID")}
              </span>
            </div>
            
              <a href="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}