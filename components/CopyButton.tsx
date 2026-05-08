"use client";

export default function CopyButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="
        w-full
        border-2
        border-dashed
        border-[#1a1a1a]
        text-[#1a1a1a]
        py-2
        rounded-lg
        text-sm
        font-semibold
        hover:bg-[#D9CFC4]
        hover:text-white
        transition-colors
      "
    >
      Salin Kode: {code}
    </button>
  );
}