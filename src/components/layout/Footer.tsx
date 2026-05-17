"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSend, FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch { /* silent */ }
  };

  const categories = [
    { name: "Papeterie", href: "/category/papeterie" },
    { name: "Informatique", href: "/category/informatique" },
    { name: "Cartouche & Toner", href: "/category/cartouche-toner" },
    { name: "Fourniture de Bureau", href: "/category/fourniture-de-bureau" },
    { name: "Librairie", href: "/category/librairie" },
    { name: "Imprimerie", href: "/category/imprimerie" },
  ];

  const quickLinks = [
    { name: "Accueil", href: "/" },
    { name: "Tous les produits", href: "/products" },
    { name: "Promotions", href: "/products?isPromotion=true" },
    { name: "Contact", href: "/contact" },
    { name: "Mon Panier", href: "/cart" },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-primary-400/20 text-gray-300">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 to-primary-800/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold text-white">
                Restez <span className="text-gradient-gold">informé</span>
              </h3>
              <p className="text-gray-400 mt-1 font-light">Recevez nos offres exclusives et nouveautés</p>
            </div>
            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary-400 font-medium"
              >
                ✓ Merci pour votre inscription !
              </motion.p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email..."
                  required
                  className="flex-1 md:w-72 px-4 py-3 bg-white/5 border border-white/10 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-400 to-primary-500 text-slate-950 font-semibold rounded-r-xl hover:shadow-glow transition-all"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-6 bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
              <img src="/logo.png" alt="Oubra Store" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
              Votre partenaire en fournitures de bureau, informatique, papeterie et services d&apos;impression au Maroc.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaWhatsapp />, href: "https://wa.me/212609240487", color: "hover:bg-green-500/20 hover:text-green-400" },
                { icon: <FiInstagram />, href: "#", color: "hover:bg-pink-500/20 hover:text-pink-400" },
                { icon: <FiFacebook />, href: "#", color: "hover:bg-blue-500/20 hover:text-blue-400" },
                { icon: <FiTwitter />, href: "#", color: "hover:bg-sky-500/20 hover:text-sky-400" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all duration-300 border border-white/5 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Liens Rapides</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Catégories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-4">
              <a href="https://wa.me/212609240487" className="flex items-start gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors">
                <FiPhone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+212 609 240 487</span>
              </a>
              <a href="mailto:oubrastore@gmail.com" className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary-400 transition-colors">
                <FiMail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>oubrastore@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Maroc</span>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435522.0774584727!2d-7.8!3d33.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca!5e0!3m2!1sfr!2sma!4v1"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Oubra Store Location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Oubra Store. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Fait avec 💛 au Maroc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
