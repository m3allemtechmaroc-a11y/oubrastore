"use client";

import { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiCopy, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

interface MediaItem { url: string; name: string }

export default function AdminMediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...data.data.map((url: string) => ({ url, name: url.split("/").pop() })), ...prev]);
        toast.success(`${data.data.length} fichier(s) uploadé(s)`);
      }
    } catch { toast.error("Erreur d'upload"); }
    setUploading(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestionnaire de <span className="text-gradient-gold">Médias</span></h1>
        <label className="btn-gold text-sm flex items-center gap-2 cursor-pointer">
          <FiUpload className="w-4 h-4" />
          {uploading ? "Upload..." : "Uploader"}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Drop zone */}
      <label className="block mb-6 p-8 border-2 border-dashed border-primary-400/20 hover:border-primary-400/40 rounded-2xl text-center cursor-pointer transition-all bg-gray-100/30 hover:bg-gray-100/50">
        <FiImage className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Glissez-déposez ou cliquez pour uploader des images</p>
        <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP — Max 10MB</p>
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-primary-400/20 transition-all">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
              <button onClick={() => copyUrl(img.url)} className="w-9 h-9 bg-gray-300 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-900 hover:bg-white/30">
                <FiCopy className="w-4 h-4" />
              </button>
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="w-9 h-9 bg-red-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-900 hover:bg-red-500/50">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FiImage className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <p>Aucun média uploadé</p>
        </div>
      )}
    </div>
  );
}
