"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { useSearchParams } from "next/navigation";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const isPromotion = searchParams.get("isPromotion");

  useEffect(() => {
    fetchProducts();
  }, [sort, category, page, isPromotion]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "12");
      params.set("sort", sort);
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (isPromotion) params.set("isPromotion", "true");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const categories = [
    { label: "Toutes", value: "" },
    { label: "Papeterie", value: "papeterie" },
    { label: "Informatique", value: "informatique" },
    { label: "Cartouche & Toner", value: "cartouche-toner" },
    { label: "Fourniture de Bureau", value: "fourniture-de-bureau" },
    { label: "Librairie", value: "librairie" },
    { label: "Services Généraux", value: "services-generaux" },
    { label: "Tirage de Plan", value: "tirage-de-plan" },
    { label: "Imprimerie", value: "imprimerie" },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
            {isPromotion ? "Promotions" : "Tous les"} <span className="text-gradient-gold">{isPromotion ? "Spéciales" : "Produits"}</span>
          </h1>
          <p className="text-gray-400 mt-2">Découvrez notre sélection complète de produits professionnels</p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="input-luxury pl-12"
            />
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 border border-primary-400/15 rounded-xl text-gray-600 hover:border-primary-400/30 transition-all"
            >
              <FiFilter className="w-4 h-4" />
              Filtres
              <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none px-4 py-2.5 pr-10 bg-gray-200 border border-primary-400/15 rounded-xl text-gray-600 focus:outline-none focus:border-primary-400"
              >
                <option value="latest">Plus récents</option>
                <option value="popular">Populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-gray-200 rounded-xl p-1">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-primary-400/20 text-primary-400" : "text-gray-400"}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-primary-400/20 text-primary-400" : "text-gray-400"}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-8 luxury-card p-6"
          >
            <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    category === cat.value
                      ? "bg-primary-400 text-slate-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              view === "grid" ? (
                <div key={i} className="flex flex-col bg-white dark:bg-zinc-950 border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] overflow-hidden p-2.5 shadow-sm">
                  <div className="aspect-square skeleton rounded-xl mb-3" />
                  <div className="p-3 space-y-3 flex-grow flex flex-col">
                    <div className="h-3 w-16 skeleton rounded" />
                    <div className="h-5 skeleton rounded" />
                    <div className="h-5 w-24 skeleton rounded mt-auto" />
                    <div className="h-3 w-20 skeleton rounded mt-2" />
                    <div className="h-10 skeleton rounded-xl mt-3" />
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col sm:flex-row gap-5 bg-white dark:bg-zinc-950 border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] overflow-hidden p-3.5 shadow-sm">
                  <div className="w-full sm:w-44 aspect-square shrink-0 skeleton rounded-xl" />
                  <div className="flex flex-col flex-grow py-1 space-y-3">
                    <div className="h-3 w-20 skeleton rounded" />
                    <div className="h-6 w-3/4 skeleton rounded" />
                    <div className="h-4 w-1/2 skeleton rounded" />
                    <div className="h-4 w-1/3 skeleton rounded mt-auto" />
                    <div className="h-10 w-44 skeleton rounded-xl mt-4 sm:self-end" />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-zinc-100 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} view={view} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  page === p
                    ? "bg-primary-400 text-slate-900"
                    : "bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
