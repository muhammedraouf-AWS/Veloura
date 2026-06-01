"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart";

type Props = {
  productId: number;
  documentId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  className?: string;
};

export function QuickAddButton({
  productId,
  documentId,
  slug,
  title,
  image,
  price,
  className = "",
}: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId, documentId, slug, title, image, price, quantity: 1 });
    toast.success("Added to cart", { description: title });
  }

  return (
    <button
      onClick={handleAdd}
      aria-label={`Add ${title} to cart`}
      className={`flex items-center justify-center gap-2 w-full bg-[oklch(0.18_0.04_280/0.85)] backdrop-blur-sm text-[oklch(0.97_0.01_60)] font-sans text-[0.7rem] tracking-[0.15em] uppercase py-3 hover:bg-[oklch(0.35_0.12_310)] transition-colors duration-200 ${className}`}
    >
      <ShoppingBag className="h-3.5 w-3.5" />
      Add to cart
    </button>
  );
}
