"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiSave, FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Category } from "@/types";
import { slugify } from "@/lib/utils";

export default function NewProductPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", shortDesc: "", price: "", compareAtPrice: "",
    stock: "0", sku: "", categoryId: "", isPromotion: false, discountPercent: "",
    promotionEnd: "", isFeatured: false, isNew: true, isPopular: false, tags: "",
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => {
      if (d.success) setCategories(d.data);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setImages([...images, ...data.data]);
    } catch { toast.error("Erreur d'upload"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.name),
          images,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
          categoryId: form.categoryId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Produit créé!");
        router.push("/admin/products");
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch { toast.error("Erreur"); }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Nouveau <span className="text-gradient-gold">Produit</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Informations</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nom du produit *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="input-luxury" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-luxury resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description courte</label>
                <input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="input-luxury" />
              </div>
            </motion.div>

            {/* Images */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-primary-400/20 hover:border-primary-400/40 flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-100/50">
                  <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Prix & Stock</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prix (DHS) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ancien prix</label>
                  <input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-luxury" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="admin-card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Organisation</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Catégorie</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-luxury">
                  <option value="">Sans catégorie</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (séparés par virgule)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-luxury" placeholder="bureau, premium" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-card space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Promotion</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isPromotion} onChange={(e) => setForm({ ...form, isPromotion: e.target.checked })} className="w-4 h-4 accent-primary-400" />
                <span className="text-sm text-gray-600">En promotion</span>
              </label>
              {form.isPromotion && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Réduction (%)</label>
                    <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Fin de promo</label>
                    <input type="datetime-local" value={form.promotionEnd} onChange={(e) => setForm({ ...form, promotionEnd: e.target.value })} className="input-luxury" />
                  </div>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="admin-card space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Visibilité</h2>
              {[
                { key: "isNew", label: "Nouveau" },
                { key: "isFeatured", label: "En vedette" },
                { key: "isPopular", label: "Populaire" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[opt.key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })} className="w-4 h-4 accent-primary-400" />
                  <span className="text-sm text-gray-600">{opt.label}</span>
                </label>
              ))}
            </motion.div>

            <button type="submit" disabled={saving} className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50">
              <FiSave className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Créer le produit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
