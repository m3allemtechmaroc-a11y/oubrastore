"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import Magnetic from "@/components/ui/Magnetic";

const promoProducts: Product[] = [
  { id: "p1", name: "Imprimante HP DeskJet 2710", slug: "imprimante-hp", price: 1999, stock: 8, images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 25, promotionEnd: null, isFeatured: true, isNew: false, isPopular: true, isActive: true, viewCount: 120, tags: [], description: null, shortDesc: null, compareAtPrice: 2699, sku: null, createdAt: "", updatedAt: "" },
  { id: "p2", name: "Ramette Papier A4 (500 feuilles)", slug: "ramette-a4", price: 55, stock: 200, images: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 30, promotionEnd: null, isFeatured: false, isNew: false, isPopular: true, isActive: true, viewCount: 85, tags: [], description: null, shortDesc: null, compareAtPrice: 79, sku: null, createdAt: "", updatedAt: "" },
  { id: "p3", name: "Cartouche HP 305XL Noir", slug: "cartouche-hp-305", price: 349, stock: 45, images: ["https://images.unsplash.com/photo-1563199284-752b07f17035?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 15, promotionEnd: null, isFeatured: true, isNew: false, isPopular: false, isActive: true, viewCount: 65, tags: [], description: null, shortDesc: null, compareAtPrice: 410, sku: null, createdAt: "", updatedAt: "" },
  { id: "p4", name: "Clavier Sans Fil Logitech", slug: "clavier-logitech", price: 299, stock: 25, images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 20, promotionEnd: null, isFeatured: false, isNew: true, isPopular: true, isActive: true, viewCount: 95, tags: [], description: null, shortDesc: null, compareAtPrice: 375, sku: null, createdAt: "", updatedAt: "" },
];

export default function PromotionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 relative overflow-hidden bg-gray-50/10 dark:bg-zinc-950/10">
      
      {/* Background Floating Orbs */}
      <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-primary-400/5 dark:bg-primary-500/5 filter blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-amber-500/5 dark:bg-amber-600/5 filter blur-3xl animate-float pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-widest bg-red-500/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Offres Limitées
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-gray-900 dark:text-zinc-100 mt-5">
              Offres <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">Spéciales</span>
            </h2>
          </div>
          
          <div className="hidden sm:block">
            <Magnetic range={40} strength={0.3}>
              <Link href="/products?isPromotion=true" className="btn-outline-gold px-6 py-2.5 rounded-xl border border-primary-400/20 hover:border-primary-400 text-sm font-semibold transition-all">
                Toutes les promos
              </Link>
            </Magnetic>
          </div>
        </motion.div>

        {/* Snappy Spring Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {promoProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
