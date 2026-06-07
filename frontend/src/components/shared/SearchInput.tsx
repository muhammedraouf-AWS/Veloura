"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";

  const [value, setValue] = useState(currentQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when landing on the search page
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce — update URL 350ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = value.trim();
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    }, 350);
    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <div className="relative">
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[oklch(0.45_0.04_280/0.35)]" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search fragrances…"
        className="w-full pl-8 pr-8 py-3 bg-transparent border-b-2 border-[oklch(0.18_0.04_280/0.2)] focus:border-[oklch(0.35_0.12_310)] outline-none font-sans text-[oklch(0.18_0.04_280)] text-xl placeholder:text-[oklch(0.45_0.04_280/0.3)] transition-colors"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.04_280/0.35)] hover:text-[oklch(0.18_0.04_280)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
