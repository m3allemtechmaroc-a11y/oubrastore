"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { formatPrice, timeAgo } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{ id: string; fullName: string; totalAmount: number; status: string; createdAt: string; items: Array<{ id: string }> }>;
  lowStockProducts: Array<{ id: string; name: string; stock: number; price: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Revenus", value: stats ? formatPrice(stats.totalRevenue) : "...", icon: <FiDollarSign />, color: "from-green-500/20 to-green-600/10", iconColor: "text-green-400" },
    { label: "Commandes", value: stats?.totalOrders ?? "...", icon: <FiShoppingCart />, color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-400" },
    { label: "Produits", value: stats?.totalProducts ?? "...", icon: <FiPackage />, color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400" },
    { label: "Clients", value: stats?.totalCustomers ?? "...", icon: <FiUsers />, color: "from-primary-500/20 to-primary-600/10", iconColor: "text-primary-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        Dashboard <span className="text-gradient-gold">Administrateur</span>
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{card.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" /> Mise à jour en temps réel
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
        >
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Commandes Récentes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
            </div>
          ) : stats?.recentOrders.length ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-100/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.fullName}</p>
                    <p className="text-xs text-gray-400">{timeAgo(new Date(order.createdAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-400">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Aucune commande</p>
          )}
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-yellow-400" /> Alertes de Stock
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
            </div>
          ) : stats?.lowStockProducts.length ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-100/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    product.stock === 0 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {product.stock} en stock
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Tous les produits sont en stock</p>
          )}
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card lg:col-span-2"
        >
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Commandes par Statut</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(stats?.ordersByStatus || []).map((item) => (
              <div key={item.status} className="p-4 bg-gray-100/50 rounded-xl text-center">
                <span className={`inline-block text-xs px-3 py-1 rounded-full mb-2 ${ORDER_STATUS_COLORS[item.status]}`}>
                  {ORDER_STATUS_LABELS[item.status]}
                </span>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
