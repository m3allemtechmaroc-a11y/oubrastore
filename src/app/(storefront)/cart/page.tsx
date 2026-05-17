"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getDiscountedPrice, generateWhatsAppLink, generateOrderWhatsAppMessage } from "@/lib/utils";
import { MIN_ORDER_AMOUNT, DEFAULT_SHIPPING_COST } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [form, setForm] = useState({ fullName: "", phone: "", city: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 799 ? 0 : DEFAULT_SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subtotal < MIN_ORDER_AMOUNT) {
      toast.error(`Commande minimum: ${formatPrice(MIN_ORDER_AMOUNT)}`);
      return;
    }
    if (!form.fullName || !form.phone || !form.city || !form.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.isPromotion && item.product.discountPercent
          ? getDiscountedPrice(item.product.price, item.product.discountPercent)
          : item.product.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          shippingCost,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Commande envoyée avec succès!");

        // Send via WhatsApp
        const whatsAppMsg = generateOrderWhatsAppMessage({
          ...form,
          items: orderItems,
          totalAmount: total,
          shippingCost,
        });
        const waLink = generateWhatsAppLink("+212609240487", whatsAppMsg);
        window.open(waLink, "_blank");

        clearCart();
      } else {
        toast.error(data.error || "Erreur lors de la commande");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
    setSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Découvrez nos produits et commencez vos achats</p>
          <Link href="/products" className="btn-gold">Voir les produits</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 mb-6 transition-colors">
            <FiArrowLeft /> Continuer mes achats
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
            Mon <span className="text-gradient-gold">Panier</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const price = item.product.isPromotion && item.product.discountPercent
                ? getDiscountedPrice(item.product.price, item.product.discountPercent)
                : item.product.price;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="luxury-card p-4 flex items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-primary-400 font-semibold">{formatPrice(price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900 transition-all"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900 transition-all"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-gray-900 font-semibold w-24 text-right">{formatPrice(price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary + Form */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="luxury-card p-6">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-4">Résumé</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span className={shippingCost === 0 ? "text-green-400" : "text-gray-900"}>
                    {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                  </span>
                </div>
                {subtotal < 799 && (
                  <p className="text-xs text-gray-400">Livraison gratuite dès {formatPrice(799)}</p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-400">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="luxury-card p-6">
              <h3 className="font-display font-semibold text-gray-900 text-sm mb-3">Code promo</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="input-luxury text-sm flex-1"
                />
                <button className="px-4 py-2 bg-gray-200 border border-primary-400/20 rounded-xl text-primary-400 text-sm font-medium hover:bg-gray-300 transition-all">
                  Appliquer
                </button>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="luxury-card p-6 space-y-4">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">Informations de livraison</h3>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Nom complet *"
                required
                className="input-luxury"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Téléphone *"
                required
                className="input-luxury"
              />
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ville *"
                required
                className="input-luxury"
              />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Adresse complète *"
                required
                className="input-luxury"
              />
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes (optionnel)"
                rows={3}
                className="input-luxury resize-none"
              />

              {subtotal < MIN_ORDER_AMOUNT && (
                <p className="text-sm text-red-400">⚠️ Commande minimum: {formatPrice(MIN_ORDER_AMOUNT)}</p>
              )}

              <button
                type="submit"
                disabled={submitting || subtotal < MIN_ORDER_AMOUNT}
                className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaWhatsapp className="w-5 h-5" />
                {submitting ? "Envoi en cours..." : "Commander via WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
