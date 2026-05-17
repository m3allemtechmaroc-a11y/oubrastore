"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiPackage, FiShoppingCart, FiUsers, FiTag, FiImage,
  FiSettings, FiMenu, FiX, FiLayers, FiGrid, FiNavigation,
  FiGift, FiLogOut, FiMail, FiPercent,
} from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: <FiHome /> },
  { label: "Produits", href: "/admin/products", icon: <FiPackage /> },
  { label: "Commandes", href: "/admin/orders", icon: <FiShoppingCart /> },
  { label: "Catégories", href: "/admin/categories", icon: <FiTag /> },
  { label: "Clients", href: "/admin/customers", icon: <FiUsers /> },
  { label: "Promotions", href: "/admin/promotions", icon: <FiPercent /> },
  { label: "Hero Carousel", href: "/admin/hero", icon: <FiLayers /> },
  { label: "Navbar", href: "/admin/navbar", icon: <FiNavigation /> },
  { label: "Activités", href: "/admin/activities", icon: <FiGrid /> },
  { label: "Coupons", href: "/admin/coupons", icon: <FiGift /> },
  { label: "Médias", href: "/admin/media", icon: <FiImage /> },
  { label: "Messages", href: "/admin/messages", icon: <FiMail /> },
  { label: "Paramètres", href: "/admin/settings", icon: <FiSettings /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 admin-sidebar flex-col fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-display font-bold text-slate-900 text-sm">
            O
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 text-sm">Oubra Store</p>
            <p className="text-xs text-primary-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary-400/10 text-primary-400 border border-primary-400/20"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="w-5 h-5">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-400/20 flex items-center justify-center text-primary-400 text-xs font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            <FiHome className="w-4 h-4" /> Voir le site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-sm text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
            <FiLogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 admin-sidebar z-50 lg:hidden"
            >
              <div className="flex items-center justify-between px-4 py-4">
                <span className="font-display font-bold text-gray-900">Admin</span>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <nav className="px-3 py-2 space-y-1">
                {menuItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                        active ? "bg-primary-400/10 text-primary-400" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <span className="w-5 h-5">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-900 rounded-lg"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Bienvenue, <span className="text-gray-900 font-medium">{user?.name || "Admin"}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
