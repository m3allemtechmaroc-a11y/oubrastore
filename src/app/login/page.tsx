"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const success = await login(form.email, form.password);
      if (success) {
        toast.success("Connexion réussie!");
        router.push("/");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
    } else {
      if (form.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        setLoading(false);
        return;
      }
      const success = await register(form.name, form.email, form.password, form.phone);
      if (success) {
        toast.success("Inscription réussie!");
        router.push("/");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-display font-bold text-slate-900 text-xl">
            O
          </div>
          <span className="font-display font-bold text-2xl text-gray-900">
            Oubra <span className="text-primary-400">Store</span>
          </span>
        </Link>

        <div className="luxury-card p-8">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === "login" ? "bg-primary-400 text-slate-900" : "text-gray-400"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === "register" ? "bg-primary-400 text-slate-900" : "text-gray-400"
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom complet"
                  required
                  className="input-luxury pl-11"
                />
              </div>
            )}

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
                className="input-luxury pl-11"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mot de passe"
                required
                className="input-luxury pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              >
                {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            {mode === "register" && (
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Téléphone (optionnel)"
                  className="input-luxury pl-11"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold disabled:opacity-50 text-center"
            >
              {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "S'inscrire"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
