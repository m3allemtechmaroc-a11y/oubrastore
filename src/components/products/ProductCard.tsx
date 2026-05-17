"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";

export default function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const finalPrice = product.isPromotion && product.discountPercent
    ? getDiscountedPrice(product.price, product.discountPercent)
    : product.price;

  const isImprimerie = product.category?.slug === "imprimerie";

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Bonjour, je suis intéressé par: ${product.name} (${formatPrice(finalPrice)})`;
    window.open(`https://wa.me/212609240487?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Horizontal List View Layout
  if (view === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-zinc-950 border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] overflow-hidden p-3.5 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Left Side: Image Container */}
        <div className="relative w-full sm:w-44 aspect-square sm:aspect-square shrink-0 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-zinc-900/50 dark:to-zinc-900/10 rounded-2xl">
          {/* Floating Badges */}
          {product.isPromotion && product.discountPercent && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-600 border border-white/20 text-white rounded-full shadow-md backdrop-blur-md text-[9px] font-bold tracking-wider uppercase">
              <span className="relative flex h-1 w-1 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
              </span>
              -{product.discountPercent}%
            </div>
          )}
          {product.isNew && !product.isPromotion && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-primary-500 border border-white/20 text-slate-950 rounded-full shadow-md backdrop-blur-md text-[9px] font-bold tracking-wider uppercase">
              Nouveau
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            {product.images[0] && !imageError ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100/50 dark:bg-zinc-900/50 text-gray-400 dark:text-zinc-600">📦</div>
            )}
          </Link>
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col flex-grow w-full py-1 pr-2">
          
          {/* Category Tag */}
          <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold mb-1">
            {product.category?.name || "Oubra Store"}
          </span>

          {/* Heading */}
          <Link href={`/products/${product.slug}`} className="block mb-2">
            <h3 className="font-display font-semibold text-[17px] text-gray-900 dark:text-zinc-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Description (short desc or placeholder) */}
          <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed max-w-xl font-normal">
            {product.description || `Découvrez ${product.name}, un produit sélectionné avec soin par Oubra Store pour sa qualité exceptionnelle et son utilité professionnelle.`}
          </p>

          {/* Bottom row: Price, Stock, Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto border-t border-black/[0.04] dark:border-white/[0.04] pt-4">
            
            {/* Price & Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-extrabold text-primary-500 dark:text-primary-400">{formatPrice(finalPrice)}</span>
                {product.isPromotion && product.compareAtPrice && (
                  <span className="text-xs text-gray-400 dark:text-zinc-500 line-through font-normal">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <span className="w-px h-4 bg-black/[0.08] dark:bg-white/[0.08]" />

              <div className="flex items-center gap-1.5">
                {product.stock > 0 ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      En stock
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[11px] font-medium text-red-500 dark:text-red-400">
                      Rupture
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              {/* Wishlist Button wrapped in Magnetic */}
              <Magnetic range={45} strength={0.35}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleItem(product.id);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border backdrop-blur-md transition-all ${
                    inWishlist 
                      ? "bg-red-500 text-white border-red-500/50 hover:bg-red-600" 
                      : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-black/[0.03] dark:border-white/[0.05] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                  }`}
                >
                  <FiHeart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
                </motion.button>
              </Magnetic>

              {/* Add to Cart Button */}
              {isImprimerie ? (
                <button
                  onClick={handleWhatsApp}
                  className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all duration-300"
                >
                  Demander devis
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (product.stock > 0) addItem(product);
                  }}
                  disabled={product.stock <= 0}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-400 to-amber-500 text-slate-950 rounded-xl text-xs font-extrabold hover:shadow-[0_8px_20px_rgba(255,215,0,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ajouter au panier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Vertical Grid Layout
  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-zinc-950 border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      
      {/* Image Container with Rounded Inset frame */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-zinc-900/50 dark:to-zinc-900/10 rounded-2xl m-2.5">
        
        {/* Floating Badges */}
        {product.isPromotion && product.discountPercent && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-600 border border-white/20 text-white rounded-full shadow-md backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            -{product.discountPercent}%
          </div>
        )}
        {product.isNew && !product.isPromotion && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-primary-500 border border-white/20 text-slate-950 rounded-full shadow-md backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
            Nouveau
          </div>
        )}

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {product.images[0] && !imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100/50 dark:bg-zinc-900/50 text-gray-400 dark:text-zinc-600">📦</div>
          )}
        </Link>

        {/* Floating Quick Action Buttons wrapped in Magnetic wrappers */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <Magnetic range={40} strength={0.35}>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(product.id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md border backdrop-blur-md transition-all ${
                inWishlist 
                  ? "bg-red-500 text-white border-red-500/50 hover:bg-red-600" 
                  : "bg-white/90 dark:bg-zinc-900/90 text-gray-800 dark:text-zinc-100 border-black/[0.03] dark:border-white/[0.05] hover:bg-primary-400 hover:text-slate-950 dark:hover:bg-primary-400 dark:hover:text-slate-950"
              }`}
            >
              <FiHeart className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} />
            </motion.button>
          </Magnetic>
          
          <Magnetic range={40} strength={0.35}>
            <Link href={`/products/${product.slug}`} onClick={(e) => e.stopPropagation()}>
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                className="w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 text-gray-800 dark:text-zinc-100 border border-black/[0.03] dark:border-white/[0.05] shadow-md backdrop-blur-md hover:bg-primary-400 hover:text-slate-950 dark:hover:bg-primary-400 dark:hover:text-slate-950 flex items-center justify-center transition-all"
              >
                <FiEye className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 pt-2 flex flex-col flex-grow">
        
        {/* Category Label */}
        <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold mb-1">
          {product.category?.name || "Oubra Store"}
        </span>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-display font-semibold text-[15px] text-gray-900 dark:text-zinc-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Rating (Sleek row) */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[18px] font-extrabold text-primary-500 dark:text-primary-400">{formatPrice(finalPrice)}</span>
          {product.isPromotion && product.compareAtPrice && (
            <span className="text-xs text-gray-400 dark:text-zinc-500 line-through font-normal">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Live Stock Status Indicator */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          {product.stock > 0 ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {product.stock} en stock
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-[11px] font-medium text-red-500 dark:text-red-400">
                Rupture de stock
              </span>
            </>
          )}
        </div>

        {/* Call to Action Button */}
        {isImprimerie ? (
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-bold hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            <FaWhatsapp className="w-4 h-4" />
            Demander un devis
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock > 0) addItem(product);
            }}
            disabled={product.stock <= 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-400 to-amber-500 text-slate-950 rounded-xl text-xs font-extrabold hover:shadow-[0_8px_20px_rgba(255,215,0,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <FiShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}
