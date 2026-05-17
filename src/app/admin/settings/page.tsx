"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp: "+212609240487",
    email: "oubrastore@gmail.com",
    phone: "+212609240487",
    address: "Maroc",
    shippingCost: "30",
    minOrder: "100",
    freeShippingMin: "799",
    googleMaps: "",
    facebook: "",
    instagram: "",
    twitter: "",
    logoUrl: "",
    companyName: "Oubra Store",
  });
  const [saving, setSaving] = useState(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings((prev) => ({ ...prev, ...d.data })); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success("Paramètres sauvegardés");
      else toast.error("Erreur");
    } catch { toast.error("Erreur"); }
    setSaving(false);
  };

  const sections = [
    {
      title: "Contact",
      fields: [
        { key: "whatsapp", label: "WhatsApp", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Téléphone", type: "text" },
        { key: "address", label: "Adresse", type: "text" },
      ],
    },
    {
      title: "Livraison & Commande",
      fields: [
        { key: "shippingCost", label: "Frais de livraison (DHS)", type: "number" },
        { key: "minOrder", label: "Commande minimum (DHS)", type: "number" },
        { key: "freeShippingMin", label: "Livraison gratuite dès (DHS)", type: "number" },
      ],
    },
    {
      title: "Réseaux Sociaux",
      fields: [
        { key: "facebook", label: "Facebook URL", type: "url" },
        { key: "instagram", label: "Instagram URL", type: "url" },
        { key: "twitter", label: "Twitter URL", type: "url" },
      ],
    },
    {
      title: "Marque",
      fields: [
        { key: "companyName", label: "Nom de l'entreprise", type: "text" },
        { key: "logoUrl", label: "URL du logo", type: "text" },
        { key: "googleMaps", label: "Lien Google Maps", type: "url" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          <span className="text-gradient-gold">Paramètres</span>
        </h1>
        <button onClick={handleSave} disabled={saving} className="btn-gold text-sm flex items-center gap-2 disabled:opacity-50">
          <FiSave className="w-4 h-4" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-gray-400 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="input-luxury"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
