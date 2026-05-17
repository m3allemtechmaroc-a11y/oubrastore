"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPercent } from "react-icons/fi";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function AdminPromotionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?isPromotion=true&pageSize=50")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        <span className="text-gradient-gold">Promotions</span>
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Gérez les promotions depuis la page de chaque produit. Les produits en promotion apparaissent ici.
      </p>

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Produit</th><th>Prix Original</th><th>Réduction</th><th>Prix Final</th><th>Stock</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 4 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j}><div className="h-4 skeleton rounded w-20" /></td>)}</tr>) :
            products.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Aucune promotion active</td></tr> :
            products.map((p) => {
              const finalPrice = p.discountPercent ? p.price - (p.price * p.discountPercent / 100) : p.price;
              return (
                <tr key={p.id}>
                  <td className="font-medium text-gray-900">{p.name}</td>
                  <td className="text-gray-400 line-through">{formatPrice(p.price)}</td>
                  <td><span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">-{p.discountPercent}%</span></td>
                  <td className="text-primary-400 font-semibold">{formatPrice(finalPrice)}</td>
                  <td>{p.stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
