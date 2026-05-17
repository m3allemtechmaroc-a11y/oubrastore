"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

interface Coupon { id: string; code: string; discountPercent: number; minOrder: number | null; maxUses: number | null; usedCount: number; isActive: boolean; expiresAt: string | null }

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "10", minOrder: "", maxUses: "", expiresAt: "" });
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    fetch("/api/coupons").then((r) => r.json()).then((d) => { if (d.success) setCoupons(d.data); }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.code) { toast.error("Code requis"); return; }
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        discountPercent: parseInt(form.discountPercent),
        minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      toast.success("Coupon créé!");
      setCoupons([data.data, ...coupons]);
      setShowForm(false);
      setForm({ code: "", discountPercent: "10", minOrder: "", maxUses: "", expiresAt: "" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestion des <span className="text-gradient-gold">Coupons</span></h1>
        <button onClick={() => setShowForm(true)} className="btn-gold text-sm flex items-center gap-2"><FiPlus className="w-4 h-4" /> Nouveau</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="admin-card mb-6 space-y-4">
          <div className="flex justify-between"><h2 className="text-lg font-semibold text-gray-900">Nouveau Coupon</h2><button onClick={() => setShowForm(false)}><FiX className="w-5 h-5 text-gray-400" /></button></div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CODE *" className="input-luxury" />
            <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Réduction %" className="input-luxury" />
            <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="Commande min (DHS)" className="input-luxury" />
            <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Utilisations max" className="input-luxury" />
          </div>
          <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-luxury" />
          <button onClick={handleCreate} className="btn-gold text-sm flex items-center gap-2"><FiSave className="w-4 h-4" /> Créer</button>
        </motion.div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Réduction</th><th>Min. Commande</th><th>Utilisations</th><th>Statut</th><th>Expire</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j}><div className="h-4 skeleton rounded w-16" /></td>)}</tr>) :
            coupons.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aucun coupon</td></tr> :
            coupons.map((c) => (
              <tr key={c.id}>
                <td className="font-mono font-bold text-primary-400">{c.code}</td>
                <td className="text-gray-900">{c.discountPercent}%</td>
                <td className="text-gray-400">{c.minOrder ? `${c.minOrder} DHS` : "—"}</td>
                <td className="text-gray-400">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</td>
                <td><span className={`text-xs px-2 py-1 rounded-full ${c.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{c.isActive ? "Actif" : "Inactif"}</span></td>
                <td className="text-gray-400 text-sm">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("fr-FR") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
