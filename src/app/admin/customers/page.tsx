"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";
import { timeAgo } from "@/lib/utils";

interface Customer { id: string; name: string; email: string; phone: string | null; role: string; createdAt: string; _count?: { orders: number } }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCustomers(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        <span className="text-gradient-gold">Clients</span>
      </h1>
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Inscrit</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j}><div className="h-4 skeleton rounded w-20" /></td>)}</tr>
              )) : customers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Aucun client</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-gray-900">{c.name}</td>
                  <td className="text-gray-400">{c.email}</td>
                  <td className="text-gray-400">{c.phone || "—"}</td>
                  <td><span className={`text-xs px-2 py-1 rounded-full ${c.role === "ADMIN" ? "bg-primary-400/20 text-primary-400" : "bg-gray-500/20 text-gray-400"}`}>{c.role}</span></td>
                  <td className="text-gray-400 text-sm">{timeAgo(new Date(c.createdAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
