"use client";

export default function CopyButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="w-full border-2 border-dashed border-orange-300 text-orange-500 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors"
    >
      Salin Kode: {code}
    </button>
  );
}