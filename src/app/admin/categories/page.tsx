"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Category } from "@/types";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });
  const token = useAuthStore((s) => s.token);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!form.name) { toast.error("Nom requis"); return; }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, slug: form.slug || slugify(form.name) }),
      });
      if (res.ok) { toast.success("Catégorie créée"); fetchCategories(); setShowForm(false); setForm({ name: "", slug: "", description: "", image: "" }); }
    } catch { toast.error("Erreur"); }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("Mise à jour!"); fetchCategories(); setEditing(null); }
    } catch { toast.error("Erreur"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { toast.success("Supprimée"); fetchCategories(); }
    } catch { toast.error("Erreur"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestion des <span className="text-gradient-gold">Catégories</span></h1>
        <button onClick={() => { setShowForm(true); setForm({ name: "", slug: "", description: "", image: "" }); }} className="btn-gold text-sm flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> Nouvelle
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="admin-card mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Nouvelle Catégorie</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-900"><FiX className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} placeholder="Nom *" className="input-luxury" />
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="input-luxury" />
          </div>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-luxury" />
          <button onClick={handleCreate} className="btn-gold text-sm flex items-center gap-2"><FiSave className="w-4 h-4" /> Créer</button>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucune catégorie</div>
        ) : (
          categories.map((cat) => (
            <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-card flex items-center justify-between">
              {editing === cat.id ? (
                <div className="flex-1 flex items-center gap-3">
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury text-sm flex-1" />
                  <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"><FiSave className="w-4 h-4" /></button>
                  <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><FiX className="w-4 h-4" /></button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(cat.id); setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image: cat.image || "" }); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
