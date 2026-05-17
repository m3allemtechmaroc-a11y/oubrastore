"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiCheck, FiX, FiTruck, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, timeAgo } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const token = useAuthStore((s) => s.token);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "50" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Statut mis à jour");
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch { toast.error("Erreur"); }
  };

  const statuses = ["", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        Gestion des <span className="text-gradient-gold">Commandes</span>
      </h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s ? "bg-primary-400 text-slate-900" : "bg-gray-200 text-gray-400 hover:text-gray-900"
            }`}
          >
            {s ? ORDER_STATUS_LABELS[s] : "Toutes"}
          </button>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Total</th>
                <th>Articles</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j}><div className="h-4 skeleton rounded w-20" /></td>)}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Aucune commande</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-gray-900">{order.fullName}</td>
                    <td>{order.phone}</td>
                    <td>{order.city}</td>
                    <td className="text-primary-400 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="text-gray-400 text-sm">{timeAgo(new Date(order.createdAt))}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><FiEye className="w-4 h-4" /></button>
                        {order.status === "PENDING" && (
                          <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"><FiCheck className="w-4 h-4" /></button>
                        )}
                        {order.status === "CONFIRMED" && (
                          <button onClick={() => updateStatus(order.id, "DELIVERED")} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><FiTruck className="w-4 h-4" /></button>
                        )}
                        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                          <button onClick={() => updateStatus(order.id, "CANCELLED")} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiX className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-100 rounded-2xl border border-primary-400/30 max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-gray-900">Détails Commande</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900"><FiX className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Client</span><span className="text-gray-900">{selectedOrder.fullName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Téléphone</span><span className="text-gray-900">{selectedOrder.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Ville</span><span className="text-gray-900">{selectedOrder.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Adresse</span><span className="text-gray-900">{selectedOrder.address}</span></div>
              {selectedOrder.notes && <div className="flex justify-between"><span className="text-gray-400">Notes</span><span className="text-gray-900">{selectedOrder.notes}</span></div>}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-primary-400 font-semibold mb-2">Articles:</p>
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between"><span className="text-gray-400">Livraison</span><span className="text-gray-900">{formatPrice(selectedOrder.shippingCost)}</span></div>
                <div className="flex justify-between text-lg font-bold mt-2"><span className="text-gray-900">Total</span><span className="text-primary-400">{formatPrice(selectedOrder.totalAmount)}</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
