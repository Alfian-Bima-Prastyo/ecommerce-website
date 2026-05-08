import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

type CartItem = {
  product_id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string, color: string) => void;
  updateQty: (product_id: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) =>
            i.product_id === item.product_id &&
            i.size === item.size &&
            i.color === item.color
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product_id === item.product_id &&
              i.size === item.size &&
              i.color === item.color
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (product_id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.product_id === product_id && i.size === size && i.color === color)
          ),
        }));
      },

      updateQty: (product_id, size, color, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id && i.size === size && i.color === color
              ? { ...i, qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "cart-storage" }
  )
);

// Gunakan hook ini di CartDrawer, bukan useCartStore langsung
export function useCartStoreHydrated() {
  const store = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return { ...store, hydrated };
}