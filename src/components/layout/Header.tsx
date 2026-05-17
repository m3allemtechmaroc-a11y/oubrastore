"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiChevronDown, FiHeart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import SearchBar from "@/components/shared/SearchBar";
import Magnetic from "@/components/ui/Magnetic";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartItems = useCartStore((s) => s.getTotalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Accueil", href: "/" },
    {
      label: "Nos Produits", href: "/products",
      children: [
        { label: "Papeterie", href: "/category/papeterie" },
        { label: "Informatique", href: "/category/informatique" },
        { label: "Cartouche & Toner", href: "/category/cartouche-toner" },
        { label: "Fourniture de Bureau", href: "/category/fourniture-de-bureau" },
        { label: "Librairie", href: "/category/librairie" },
        { label: "Tous les produits", href: "/products" },
      ],
    },
    {
      label: "Services", href: "#",
      children: [
        { label: "Imprimerie", href: "/category/imprimerie" },
        { label: "Tirage de Plan", href: "/category/tirage-de-plan" },
        { label: "Services Généraux", href: "/category/services-generaux" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ];

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-3 pointer-events-none"
      >
        <div className={`w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${
          scrolled
            ? "max-w-5xl mx-auto bg-white/70 dark:bg-zinc-950/70 border border-primary-400/25 rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-md px-6 py-1"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent py-2"
        }`}>
          <div className="flex items-center justify-between h-14 lg:h-16">
            
            {/* Logo wrapped in subtle Magnetic effect */}
            <Magnetic range={40} strength={0.2}>
              <Link href="/" className="flex items-center group bg-gray-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl hover:bg-gray-200/80 dark:hover:bg-zinc-900 transition-colors">
                <img src="/logo.png" alt="Oubra Store" className="h-8 sm:h-10 w-auto object-contain" />
              </Link>
            </Magnetic>

            {/* Desktop Navigation Links with Magnetic wrapper */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && handleDropdownEnter(link.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Magnetic range={30} strength={0.25}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-gray-100/50 dark:hover:bg-zinc-900/50"
                    >
                      {link.label}
                      {link.children && <FiChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />}
                    </Link>
                  </Magnetic>

                  {/* Glassy Dropdown with satisfying spring physics */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="absolute top-full left-0 mt-3 w-56 py-2.5 bg-white/90 dark:bg-zinc-950/90 border border-primary-400/20 rounded-[20px] shadow-2xl backdrop-blur-md overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-400/5 transition-all"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Action Icons with Magnetic wrappers */}
            <div className="flex items-center gap-1.5">
              
              {/* Search Toggle */}
              <Magnetic range={35} strength={0.3}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-gray-100/60 dark:hover:bg-zinc-900 rounded-xl transition-all"
                  aria-label="Rechercher"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </Magnetic>

              {/* Wishlist Link */}
              <Magnetic range={35} strength={0.3}>
                <Link
                  href="/wishlist"
                  className="p-2.5 text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-gray-100/60 dark:hover:bg-zinc-900 rounded-xl transition-all hidden sm:flex"
                  aria-label="Favoris"
                >
                  <FiHeart className="w-5 h-5" />
                </Link>
              </Magnetic>

              {/* Cart Button */}
              <Magnetic range={35} strength={0.3}>
                <Link
                  href="/cart"
                  className="relative p-2.5 text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-gray-100/60 dark:hover:bg-zinc-900 rounded-xl transition-all flex"
                  aria-label="Panier"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {mounted && cartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-[10px] font-extrabold text-slate-900 shadow-md"
                    >
                      {cartItems}
                    </motion.span>
                  )}
                </Link>
              </Magnetic>

              {/* User Profil Dropdown or Login CTA */}
              {mounted ? (
                user ? (
                  <div className="relative group">
                    <Magnetic range={30} strength={0.25}>
                      <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:text-primary-500 rounded-xl hover:bg-gray-100/60 dark:hover:bg-zinc-900 transition-all">
                        <FiUser className="w-4 h-4" />
                        <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                      </button>
                    </Magnetic>
                    
                    <div className="absolute right-0 top-full mt-3 w-48 py-2 bg-white/90 dark:bg-zinc-950/90 border border-primary-400/20 rounded-[20px] shadow-2xl backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      {user.role === "ADMIN" && (
                        <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-primary-400/5">
                          Dashboard Admin
                        </Link>
                      )}
                      <Link href="/profile" className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-primary-400/5">
                        Mon Profil
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/5"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <Magnetic range={35} strength={0.25}>
                    <Link
                      href="/login"
                      className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold bg-gradient-to-r from-primary-400 to-amber-500 text-slate-900 rounded-full hover:shadow-glow transition-all duration-300"
                    >
                      <FiUser className="w-4 h-4" />
                      Connexion
                    </Link>
                  </Magnetic>
                )
              ) : (
                <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium opacity-0">
                  <FiUser className="w-4 h-4" />
                  Connexion
                </div>
              )}

              {/* Mobile Menu Toggle button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-gray-600 dark:text-zinc-300 hover:text-primary-500 rounded-xl transition-all"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="border-t border-gray-200/50 dark:border-zinc-800/50 overflow-hidden pointer-events-auto rounded-[24px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md max-w-2xl mx-auto mt-2 shadow-lg"
            >
              <div className="px-4 py-4">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 dark:bg-zinc-950/95 border-l border-black/[0.05] dark:border-white/[0.05] backdrop-blur-xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-extrabold text-lg text-gray-900 dark:text-zinc-100">
                    Oubra <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">Store</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-950 dark:hover:text-zinc-100 rounded-lg"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => !link.children && setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-zinc-300 hover:text-primary-500 hover:bg-gray-100/50 dark:hover:bg-zinc-900/50 rounded-xl transition-all font-semibold"
                      >
                        {link.label}
                        {link.children && <FiChevronDown className="w-4 h-4" />}
                      </Link>
                      {link.children && (
                        <div className="pl-4 space-y-1 mt-1 border-l border-black/[0.04] dark:border-white/[0.04] ml-4">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/50 rounded-lg transition-all"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.05]">
                  {!user && (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-400 to-amber-500 text-slate-900 font-extrabold rounded-full shadow-md"
                    >
                      <FiUser className="w-4 h-4" />
                      Connexion
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
