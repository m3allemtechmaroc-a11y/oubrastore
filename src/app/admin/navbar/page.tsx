"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

interface NavItem { id: string; label: string; href: string; orderIndex: number; isActive: boolean; isMegaMenu: boolean; }

export default function AdminNavbarPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", href: "", orderIndex: 0, isMegaMenu: false });
  const token = useAuthStore((s) => s.token);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/navbar"); const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    if (!form.label || !form.href) { toast.error("Label et lien requis"); return; }
    const res = await fetch("/api/navbar", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Élément créé!"); fetchItems(); setShowForm(false); setForm({ label: "", href: "", orderIndex: 0, isMegaMenu: false }); }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/navbar/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Mis à jour!"); fetchItems(); setEditing(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/navbar/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Supprimé"); fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestion du <span className="text-gradient-gold">Navbar</span></h1>
        <button onClick={() => setShowForm(true)} className="btn-gold text-sm flex items-center gap-2"><FiPlus className="w-4 h-4" /> Ajouter</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="admin-card mb-6 space-y-4">
          <div className="flex justify-between"><h2 className="text-lg font-semibold text-gray-900">Nouvel élément</h2><button onClick={() => setShowForm(false)}><FiX className="w-5 h-5 text-gray-400" /></button></div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label *" className="input-luxury" />
            <input type="text" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="Lien (/products) *" className="input-luxury" />
          </div>
          <div className="flex items-center gap-4">
            <input type="number" value={form.orderIndex} onChange={(e) => setForm({ ...form, orderIndex: parseInt(e.target.value) })} placeholder="Ordre" className="input-luxury w-24" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isMegaMenu} onChange={(e) => setForm({ ...form, isMegaMenu: e.target.checked })} className="w-4 h-4 accent-primary-400" />
              <span className="text-sm text-gray-600">Mega Menu</span>
            </label>
          </div>
          <button onClick={handleCreate} className="btn-gold text-sm flex items-center gap-2"><FiSave className="w-4 h-4" /> Créer</button>
        </motion.div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 skeleton rounded-xl" />) :
        items.map((item) => (
          <div key={item.id} className="admin-card flex items-center justify-between">
            {editing === item.id ? (
              <div className="flex-1 flex items-center gap-3">
                <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-luxury text-sm flex-1" />
                <input type="text" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="input-luxury text-sm flex-1" />
                <button onClick={() => handleUpdate(item.id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"><FiSave className="w-4 h-4" /></button>
                <button onClick={() => setEditing(null)} className="p-2 text-gray-400"><FiX className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.href}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">#{item.orderIndex}</span>
                  <button onClick={() => { setEditing(item.id); setForm({ label: item.label, href: item.href, orderIndex: item.orderIndex, isMegaMenu: item.isMegaMenu }); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
