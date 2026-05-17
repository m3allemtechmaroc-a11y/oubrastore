"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { HeroSlide } from "@/types";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image: "", title: "", subtitle: "", buttonText: "", buttonLink: "", orderIndex: 0 });
  const token = useAuthStore((s) => s.token);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la récupération des slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("files", files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.data[0] }));
        toast.success("Image téléchargée avec succès !");
      } else {
        toast.error(data.error || "Erreur de téléchargement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ image: "", title: "", subtitle: "", buttonText: "", buttonLink: "", orderIndex: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!form.image) {
      toast.error("L'image est requise");
      return;
    }

    const payload = {
      ...form,
      title: form.title || "Bannière",
    };

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Slide créé avec succès !");
        fetchSlides();
        resetForm();
      } else {
        toast.error("Erreur lors de la création");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!form.image) {
      toast.error("L'image est requise");
      return;
    }

    const payload = {
      ...form,
      title: form.title || "Bannière",
    };

    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Slide mis à jour !");
        fetchSlides();
        resetForm();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce slide ?")) return;
    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Slide supprimé !");
        fetchSlides();
      } else {
        toast.error("Erreur de suppression");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion");
    }
  };

  const startEdit = (slide: HeroSlide) => {
    setEditing(slide.id);
    setForm({
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle || "",
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      orderIndex: slide.orderIndex
    });
    setShowForm(true);
    // Scroll smoothly to the form container
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900 dark:text-zinc-100">
            Hero <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">Carousel</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Gérez les slides de la bannière principale de votre boutique.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-gold text-xs sm:text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-glow transition-all duration-300"
          >
            <FiPlus className="w-4 h-4" /> Nouveau Slide
          </button>
        )}
      </div>

      {/* Slide Creation & Modification Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="admin-card mb-8 space-y-5 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-black/[0.05] dark:border-white/[0.08] shadow-md"
          >
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.05] pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                {editing ? "Modifier le Slide" : "Créer un Nouveau Slide"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Subtitle inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Titre du Slide (Interne / Optionnel)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Bienvenue chez Oubra Store"
                  className="input-luxury"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Sous-titre / Description</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Ex: Votre partenaire en fournitures de bureau et solutions d'impression"
                  className="input-luxury"
                />
              </div>

              {/* Call to actions fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="Ex: Découvrir"
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Lien du bouton</label>
                  <input
                    type="text"
                    value={form.buttonLink}
                    onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                    placeholder="Ex: /category/informatique"
                    className="input-luxury"
                  />
                </div>
              </div>

              {/* Image URL & File Upload row */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Image du Slide *</label>
                
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Collez l'URL de l'image directe (ou téléchargez-en une ci-dessous)"
                  className="input-luxury"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="w-full sm:flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-primary-400/20 hover:border-primary-400/50 rounded-xl cursor-pointer transition-all">
                    <FiUpload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400 font-medium">
                      {uploading ? "Téléchargement..." : form.image ? "Changer d'image ✓" : "Uploader un fichier image"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  
                  <div className="w-full sm:w-28 flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 dark:text-zinc-400 font-semibold uppercase">Ordre:</span>
                    <input
                      type="number"
                      value={form.orderIndex}
                      onChange={(e) => setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="input-luxury text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.05]">
                  <img src={form.image} alt="Aperçu" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md bg-black/45 px-2.5 py-1 rounded-full">Aperçu Visuel</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Save Row */}
            <div className="flex items-center gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
              {editing ? (
                <>
                  <button
                    onClick={() => handleUpdate(editing)}
                    className="btn-gold text-xs sm:text-sm flex items-center gap-2 px-5 py-2.5 rounded-xl hover:shadow-glow transition-all"
                  >
                    <FiSave className="w-4 h-4" /> Enregistrer les modifications
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCreate}
                    className="btn-gold text-xs sm:text-sm flex items-center gap-2 px-5 py-2.5 rounded-xl hover:shadow-glow transition-all"
                  >
                    <FiSave className="w-4 h-4" /> Créer le Slide
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  >
                    Fermer
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slides Grid / List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-2xl" />
          ))
        ) : slides.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-dashed border-black/[0.05] dark:border-white/[0.08] rounded-2xl text-gray-400">
            Aucun slide de carrousel disponible.
          </div>
        ) : (
          slides.map((slide) => (
            <div
              key={slide.id}
              className="admin-card flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-zinc-950 border border-black/[0.05] dark:border-white/[0.08] p-4 rounded-2xl hover:shadow-md transition-all duration-300"
            >
              {/* Thumbnail preview */}
              <div className="w-full sm:w-36 h-20 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 shrink-0 border border-black/[0.03] dark:border-white/[0.04]">
                {slide.image ? (
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">🖼️</div>
                )}
              </div>

              {/* Text metadata */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-400/10 text-primary-500 px-2 py-0.5 rounded-full">
                    Slide #{slide.orderIndex}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 truncate mt-1 text-[16px]">{slide.title}</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-0.5">{slide.subtitle || "Pas de sous-titre"}</p>
                {slide.buttonText && (
                  <p className="text-[11px] font-semibold text-primary-500 dark:text-primary-400 mt-1">
                    Bouton: {slide.buttonText} → <span className="underline">{slide.buttonLink || "/"}</span>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 border-black/[0.05] dark:border-white/[0.05] pt-3 sm:pt-0 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => startEdit(slide)}
                  className="p-2.5 text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-xl transition-all"
                  title="Modifier"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2.5 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-all"
                  title="Supprimer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
