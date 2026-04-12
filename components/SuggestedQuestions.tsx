"use client";

type Props = {
  productName: string;
  productId: string;
};

const questions = (name: string) => [
  `Cek stok ${name} ukuran M`,
  `Apakah ${name} ada diskon?`,
  `Rekomendasikan produk serupa dengan ${name}`,
  `Berapa harga ${name} dengan voucher WELCOME10?`,
];

export default function SuggestedQuestions({ productName, productId }: Props) {
  const handleAsk = (question: string) => {
    const button = document.querySelector<HTMLElement>("#chainlit-copilot-button");
    const isOpen = button?.getAttribute("aria-expanded") === "true";
    if (!isOpen && button) button.click();
  };

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-600">🤖</span>
        <h3 className="font-semibold text-gray-700 text-sm">
          Tanya AI tentang produk ini
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions(productName).map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            className="bg-blue-50 text-blue-600 text-xs px-3 py-2 rounded-full hover:bg-blue-100 transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}