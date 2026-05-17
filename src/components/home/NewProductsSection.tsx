"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import Magnetic from "@/components/ui/Magnetic";

const demoProducts: Product[] = [
  { id: "1", name: "Stylo Bille Premium", slug: "stylo-bille-premium", price: 15, stock: 50, images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80"], categoryId: null, category: null, isPromotion: false, discountPercent: null, promotionEnd: null, isFeatured: true, isNew: true, isPopular: false, isActive: true, viewCount: 0, tags: [], description: "Stylo bille de haute qualité", shortDesc: null, compareAtPrice: null, sku: null, createdAt: "", updatedAt: "" },
  { id: "2", name: "Cahier A4 200 Pages", slug: "cahier-a4-200", price: 35, stock: 100, images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 20, promotionEnd: null, isFeatured: false, isNew: true, isPopular: true, isActive: true, viewCount: 0, tags: [], description: null, shortDesc: null, compareAtPrice: 45, sku: null, createdAt: "", updatedAt: "" },
  { id: "3", name: "Calculatrice Scientifique", slug: "calculatrice-scientifique", price: 199, stock: 30, images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80"], categoryId: null, category: null, isPromotion: false, discountPercent: null, promotionEnd: null, isFeatured: true, isNew: true, isPopular: false, isActive: true, viewCount: 0, tags: [], description: null, shortDesc: null, compareAtPrice: null, sku: null, createdAt: "", updatedAt: "" },
  { id: "4", name: "Pack Bureau Complet", slug: "pack-bureau-complet", price: 450, stock: 15, images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80"], categoryId: null, category: null, isPromotion: true, discountPercent: 15, promotionEnd: null, isFeatured: true, isNew: true, isPopular: true, isActive: true, viewCount: 0, tags: [], description: null, shortDesc: null, compareAtPrice: 530, sku: null, createdAt: "", updatedAt: "" },
];

export default function NewProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-primary-500 dark:text-primary-400 text-xs font-bold uppercase tracking-widest bg-primary-500/10 px-3.5 py-1.5 rounded-full">
              Nouveautés
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-gray-900 dark:text-zinc-100 mt-5">
              Nos Nouveaux <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">Produits</span>
            </h2>
          </div>
          
          <div className="hidden sm:block">
            <Magnetic range={40} strength={0.3}>
              <Link href="/products" className="btn-outline-gold px-6 py-2.5 rounded-xl border border-primary-400/20 hover:border-primary-400 text-sm font-semibold transition-all">
                Voir tous
              </Link>
            </Magnetic>
          </div>
        </motion.div>

        {/* Product Cards with Satisfying Elastic Grid Entry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {demoProducts.map((product, index) => (
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

        {/* Mobile Call to Action */}
        <div className="mt-12 text-center sm:hidden">
          <Magnetic range={40} strength={0.25}>
            <Link href="/products" className="btn-outline-gold px-6 py-3 rounded-full text-xs font-bold border border-primary-400/20">
              Voir tous les produits
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
