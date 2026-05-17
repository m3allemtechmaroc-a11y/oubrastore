"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
  products: { id: string; name: string; slug: string; price: number; images: string[]; isPromotion: boolean; discountPercent: number | null }[];
  categories: { id: string; name: string; slug: string }[];
}

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults(null); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch { /* silent */ }
      setLoading(false);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <FiSearch className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher produits, catégories..."
          className="w-full pl-12 pr-12 py-3 bg-gray-200 border border-primary-400/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-400 transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(""); onClose?.(); }} className="absolute right-4 text-gray-400 hover:text-gray-900">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results && (results.products.length > 0 || results.categories.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-100/95 backdrop-blur-xl border border-primary-400/30 rounded-xl shadow-luxury-lg overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {results.categories.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2 px-2">Catégories</p>
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-400 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            {results.products.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2 px-2">Produits</p>
                {results.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xs text-gray-400 overflow-hidden shrink-0">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">{product.name}</p>
                      <p className="text-xs text-primary-400 font-medium">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {loading && (
              <div className="p-4 text-center text-sm text-gray-400">Recherche...</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
