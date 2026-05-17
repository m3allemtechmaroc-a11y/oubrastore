"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Activity } from "@/types";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", image: "", description: "", buttonText: "Découvrir", buttonLink: "", orderIndex: 0 });
  const token = useAuthStore((s) => s.token);

  const fetchActivities = async () => {
    setLoading(true);
    const res = await fetch("/api/activities"); const data = await res.json();
    if (data.success) setActivities(data.data);
    setLoading(false);
  };
  useEffect(() => { fetchActivities(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    const fd = new FormData(); fd.append("files", files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) setForm({ ...form, image: data.data[0] });
  };

  const handleCreate = async () => {
    if (!form.title) { toast.error("Titre requis"); return; }
    const res = await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Activité créée!"); fetchActivities(); setShowForm(false); setForm({ title: "", image: "", description: "", buttonText: "Découvrir", buttonLink: "", orderIndex: 0 }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/activities/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Supprimée"); fetchActivities();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestion des <span className="text-gradient-gold">Activités</span></h1>
        <button onClick={() => setShowForm(true)} className="btn-gold text-sm flex items-center gap-2"><FiPlus className="w-4 h-4" /> Nouvelle</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="admin-card mb-6 space-y-4">
          <div className="flex justify-between"><h2 className="text-lg font-semibold text-gray-900">Nouvelle Activité</h2><button onClick={() => setShowForm(false)}><FiX className="w-5 h-5 text-gray-400" /></button></div>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" className="input-luxury" />
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-luxury" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Texte bouton" className="input-luxury" />
            <input type="text" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} placeholder="Lien" className="input-luxury" />
          </div>
          <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-dashed border-primary-400/20 rounded-xl cursor-pointer">
            <FiUpload className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">{form.image ? "✓ Image" : "Uploader image"}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {form.image && <img src={form.image} alt="" className="w-full h-32 object-cover rounded-xl" />}
          <button onClick={handleCreate} className="btn-gold text-sm flex items-center gap-2"><FiSave className="w-4 h-4" /> Créer</button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 skeleton rounded-xl" />) :
        activities.map((act) => (
          <div key={act.id} className="admin-card overflow-hidden">
            {act.image && <img src={act.image} alt="" className="w-full h-32 object-cover" />}
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{act.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{act.description || "—"}</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleDelete(act.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
