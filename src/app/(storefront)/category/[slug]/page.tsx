"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";

const categoryNames: Record<string, string> = {
  "papeterie": "Papeterie",
  "informatique": "Informatique",
  "cartouche-toner": "Cartouche & Toner",
  "services-generaux": "Services Généraux",
  "fourniture-de-bureau": "Fourniture de Bureau",
  "tirage-de-plan": "Tirage de Plan",
  "librairie": "Librairie",
  "imprimerie": "Imprimerie",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?category=${slug}&pageSize=20`);
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch { /* silent */ }
      setLoading(false);
    }
    fetchProducts();
  }, [slug]);

  const isImprimerie = slug === "imprimerie";
  const categoryName = categoryNames[slug] || slug;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
            <span className="text-gradient-gold">{categoryName}</span>
          </h1>
          <p className="text-gray-400 mt-2">
            {isImprimerie
              ? "Services d'impression professionnels — Contactez-nous pour un devis personnalisé"
              : `Découvrez notre sélection de produits ${categoryName.toLowerCase()}`}
          </p>
        </motion.div>

        {/* Imprimerie: Special Contact Section */}
        {isImprimerie && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="luxury-card p-8 mb-10 text-center"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-zinc-100 mb-4">
              Demandez votre <span className="text-gradient-gold">Devis Gratuit</span>
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-6 max-w-2xl mx-auto font-normal">
              Pour les services d&apos;imprimerie, contactez-nous directement par WhatsApp ou remplissez notre formulaire de contact pour recevoir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/212609240487?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20un%20service%20d%27imprimerie."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl hover:shadow-glow transition-all"
              >
                📱 Contacter par WhatsApp
              </a>
              <a href="/contact" className="btn-outline-gold flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-400/20 hover:border-primary-400 transition-all text-gray-600 dark:text-zinc-300">
                ✉️ Formulaire de Contact
              </a>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-zinc-100 mb-2">Aucun produit dans cette catégorie</h3>
            <p className="text-gray-400">Revenez bientôt pour découvrir nos nouveautés</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
