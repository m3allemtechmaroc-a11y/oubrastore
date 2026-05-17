"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = useAuthStore((s) => s.token);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "15" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Produit supprimé");
        fetchProducts();
      }
    } catch { toast.error("Erreur"); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Gestion des <span className="text-gradient-gold">Produits</span>
        </h1>
        <Link href="/admin/products/new" className="btn-gold text-sm flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> Nouveau Produit
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="input-luxury pl-11"
          />
        </div>
        <button type="submit" className="px-6 py-2.5 bg-gray-200 border border-primary-400/15 rounded-xl text-primary-400 hover:bg-gray-300 transition-all">
          Rechercher
        </button>
      </form>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Promo</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j}><div className="h-4 skeleton rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Aucun produit</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-600" /></div>
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-gray-900 max-w-[200px] truncate">{product.name}</td>
                    <td className="text-primary-400 font-semibold">{formatPrice(product.price)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0 ? "bg-red-500/20 text-red-400" :
                        product.stock <= 5 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-gray-400">{product.category?.name || "—"}</td>
                    <td>
                      {product.isPromotion ? (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">-{product.discountPercent}%</span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {product.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? "bg-primary-400 text-slate-900" : "bg-gray-200 text-gray-400 hover:text-gray-900"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
