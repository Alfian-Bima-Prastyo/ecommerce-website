export interface ProductImageVariant {
  src: string;
  label?: string; 
}

export const productImageVariants: Record<string, ProductImageVariant[]> = {
  "SKU-10001": [
    { src: "/img/kaos_polos.png", label: "Cream" },
    { src: "/img/sk-10001-black.png", label: "black" },
    { src: "/img/sk-10001-grey.png", label: "grey" },
  ],
  "SKU-10002": [
    { src: "/img/kemeja_batik_lengan_panjang.png", label: "Coklat" },
  ],
  "SKU-10003": [
    { src: "/img/sk-10003-khaki.png", label: "khaki" },
    { src: "/img/sk-10003-navy.png", label: "Navy" },
    { src: "/img/sk-10003-cokelatmuda.png", label: "cokelatmuda" },
  ],
  "SKU-10004": [
    { src: "/img/sepatu_sneakers.png", label: "Putih" },
    { src: "/img/sepatu_sneakers_hitam.png", label: "Hitam" },
  ],
  "SKU-10005": [
    { src: "/img/jaket_bomber.png", label: "Olive" },
    { src: "/img/jaket_bomber_hitam.png", label: "Hitam" },
    { src: "/img/jaket_bomber_navy.png", label: "Navy" },
  ],
  "SKU-10006": [{ src: "/img/dress_midi.png" }],
  "SKU-10007": [
    { src: "/img/hijab.png", label: "Krem" },
    { src: "/img/hijab_abu.png", label: "Abu-abu" },
    { src: "/img/hijab_putih.png", label: "Putih" },
  ],
  "SKU-10008": [{ src: "/img/tas_selempang.png" }],
  "SKU-10009": [{ src: "/img/sepatu_wanita.png" }],
  "SKU-10010": [{ src: "/img/blouse.png" }],
  "SKU-10011": [{ src: "/img/earphone.png" }],
  "SKU-10012": [
    { src: "/img/case.png", label: "Transparan" },
    { src: "/img/case_hitam.png", label: "Hitam" },
  ],
  "SKU-10013": [{ src: "/img/charger.png" }],
  "SKU-10014": [
    { src: "/img/mouse.png", label: "Hitam" },
    { src: "/img/mouse_putih.png", label: "Putih" },
  ],
  "SKU-10015": [{ src: "/img/keyboard.png" }],
  "SKU-10016": [{ src: "/img/wajan.png" }],
  "SKU-10017": [{ src: "/img/toples.png" }],
  "SKU-10018": [{ src: "/img/bantal.png" }],
  "SKU-10019": [{ src: "/img/pel.png" }],
  "SKU-10020": [{ src: "/img/lampu_led.png" }],
  "SKU-10021": [{ src: "/img/moist.png" }],
  "SKU-10022": [{ src: "/img/serum.png" }],
  "SKU-10023": [
    { src: "/img/shampoo.png", label: "Original" },
    { src: "/img/shampoo_dandruff.png", label: "Anti-Dandruff" },
  ],
  "SKU-10024": [
    { src: "/img/lipstick.png", label: "Rose Red" },
    { src: "/img/lipstick_nude.png", label: "Nude" },
    { src: "/img/lipstick_berry.png", label: "Berry" },
  ],
  "SKU-10025": [
    { src: "/img/lipstick.png", label: "Coral" },
    { src: "/img/lipstick_nude.png", label: "Nude Pink" },
  ],
};

// Legacy flat map — still used as fallback
export const productImages: Record<string, string> = Object.fromEntries(
  Object.entries(productImageVariants).map(([id, variants]) => [
    id,
    variants[0]?.src ?? "/img/placeholder.png",
  ])
);

export function getProductImage(productId: string): string {
  return productImages[productId] ?? "/img/placeholder.png";
}

export function getProductVariants(productId: string): ProductImageVariant[] {
  return productImageVariants[productId] ?? [
    { src: getProductImage(productId) },
  ];
}