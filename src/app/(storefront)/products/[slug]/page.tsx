"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiArrowLeft, FiStar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products?search=${slug}&pageSize=1`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setProduct(d.data[0]); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-6 w-1/4 skeleton rounded" />
            <div className="h-20 skeleton rounded" />
            <div className="h-12 w-1/2 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="text-6xl mb-4">📦</p>
        <h2 className="text-2xl font-display font-bold text-gray-900">Produit introuvable</h2>
        <Link href="/products" className="btn-outline-gold mt-6 inline-block">Voir les produits</Link>
      </div>
    );
  }

  const finalPrice = product.isPromotion && product.discountPercent
    ? getDiscountedPrice(product.price, product.discountPercent)
    : product.price;
  const inWishlist = isInWishlist(product.id);
  const isImprimerie = product.category?.slug === "imprimerie";

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success("Ajouté au panier!");
  };

  const handleWhatsApp = () => {
    const msg = `Bonjour, je suis intéressé par: ${product.name} (${formatPrice(finalPrice)})`;
    window.open(`https://wa.me/212609240487?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 mb-6">
          <FiArrowLeft /> Retour aux produits
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              {product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-primary-400" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {product.category && (
              <Link href={`/category/${product.category.slug}`} className="text-sm text-primary-400 hover:underline">
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl font-display font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-400">{formatPrice(finalPrice)}</span>
              {product.isPromotion && product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              {product.isPromotion && product.discountPercent && (
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">-{product.discountPercent}%</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-gray-400">{product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}</span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Actions */}
            {!isImprimerie ? (
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">Quantité:</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-300">
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900 text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-300">
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FiShoppingCart className="w-5 h-5" /> Ajouter au panier
                  </button>
                  <button
                    onClick={() => toggleItem(product.id)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      inWishlist ? "bg-red-500/20 border-red-500/30 text-red-400" : "border-gray-200 text-gray-400 hover:text-red-400"
                    }`}
                  >
                    <FiHeart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                </div>

                <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all">
                  <FaWhatsapp className="w-5 h-5" /> Commander via WhatsApp
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary-400/5 border border-primary-400/20 rounded-xl">
                  <p className="text-sm text-gray-600">Pour les services d&apos;imprimerie, contactez-nous pour un devis personnalisé.</p>
                </div>
                <button onClick={handleWhatsApp} className="w-full btn-gold flex items-center justify-center gap-2">
                  <FaWhatsapp className="w-5 h-5" /> Demander un devis
                </button>
                <Link href="/contact" className="block w-full text-center btn-outline-gold">Formulaire de contact</Link>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-gray-200 text-gray-400 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
