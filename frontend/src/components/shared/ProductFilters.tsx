"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest",             value: "newest"     },
  { label: "Featured",           value: "featured"   },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

const PRICE_OPTIONS = [
  { label: "All prices",  value: ""          },
  { label: "Under $100",  value: "under_100" },
  { label: "$100 – $200", value: "100_200"   },
  { label: "Over $200",   value: "over_200"  },
] as const;

type Category = { name: string; slug: string };

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentSort     = searchParams.get("sort")     ?? "newest";
  const currentCategory = searchParams.get("category") ?? "";
  const currentPrice    = searchParams.get("price")    ?? "";

  const activeCount = [
    currentSort !== "newest",
    currentCategory !== "",
    currentPrice !== "",
  ].filter(Boolean).length;

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    params.delete("page"); // reset pagination when filters change
    router.replace(`/products?${params.toString()}`);
  }

  const filterContent = (
    <div className="space-y-8">
      {activeCount > 0 && (
        <button
          onClick={() => router.replace("/products")}
          className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.12em] uppercase font-sans text-[oklch(0.55_0.18_25)] hover:text-[oklch(0.45_0.15_25)] transition-colors"
        >
          <X className="h-3 w-3" />
          Clear all ({activeCount})
        </button>
      )}

      {/* Sort */}
      <FilterGroup label="Sort">
        {SORT_OPTIONS.map((opt) => (
          <FilterOption
            key={opt.value}
            label={opt.label}
            active={currentSort === opt.value}
            onClick={() => update("sort", opt.value === "newest" ? "" : opt.value)}
          />
        ))}
      </FilterGroup>

      {/* Category */}
      <FilterGroup label="Category">
        <FilterOption
          label="All categories"
          active={currentCategory === ""}
          onClick={() => update("category", "")}
        />
        {categories.map((cat) => (
          <FilterOption
            key={cat.slug}
            label={cat.name}
            active={currentCategory === cat.slug}
            onClick={() => update("category", cat.slug)}
          />
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup label="Price">
        {PRICE_OPTIONS.map((opt) => (
          <FilterOption
            key={opt.value || "all"}
            label={opt.label}
            active={currentPrice === opt.value}
            onClick={() => update("price", opt.value)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 border border-[oklch(0.18_0.04_280/0.2)] px-4 py-2.5 text-sm font-sans text-[oklch(0.18_0.04_280)] hover:border-[oklch(0.35_0.12_310)] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
        {open && (
          <div className="mt-4 border border-[oklch(0.18_0.04_280/0.1)] p-5">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-24 self-start">
        {filterContent}
      </aside>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.62rem] tracking-[0.2em] uppercase font-sans text-[oklch(0.45_0.04_280/0.5)] mb-3">
        {label}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full text-left text-sm font-sans transition-colors ${
        active
          ? "text-[oklch(0.35_0.12_310)]"
          : "text-[oklch(0.45_0.04_280/0.6)] hover:text-[oklch(0.18_0.04_280)]"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
          active
            ? "border-[oklch(0.35_0.12_310)] bg-[oklch(0.35_0.12_310)]"
            : "border-[oklch(0.45_0.04_280/0.3)]"
        }`}
      >
        {active && (
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.97_0.01_60)]" />
        )}
      </span>
      {label}
    </button>
  );
}
