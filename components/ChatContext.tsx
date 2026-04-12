"use client";

import { useEffect } from "react";

type Product = {
  product_id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
};

export default function ChatContext({ product }: { product: Product }) {
  useEffect(() => {
    const sendContext = () => {
      // @ts-ignore
      if (window.sendChainlitMessage) {
        // @ts-ignore
        window.sendChainlitMessage({
        type: "user_message",
        output: `Saya sedang melihat produk: ${product.name} (${product.product_id}), harga Rp ${product.price.toLocaleString("id-ID")}, kategori ${product.category}, rating ${product.rating}.`,
        });
      }
    };

    const interval = setInterval(() => {
      // @ts-ignore
      if (window.sendChainlitMessage) {
        sendContext();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [product]);

  return null;
}