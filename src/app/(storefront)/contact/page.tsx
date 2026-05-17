"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message envoyé avec succès!");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Erreur lors de l'envoi");
      }
    } catch {
      toast.error("Erreur de connexion");
    }
    setSubmitting(false);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
            Contactez <span className="text-gradient-gold">Nous</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="luxury-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <FaWhatsapp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">WhatsApp</h3>
                <a href="https://wa.me/212609240487" className="text-gray-400 hover:text-green-400 transition-colors">+212 609 240 487</a>
              </div>
            </div>

            <div className="luxury-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-400/10 flex items-center justify-center shrink-0">
                <FiMail className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Email</h3>
                <a href="mailto:oubrastore@gmail.com" className="text-gray-400 hover:text-primary-400 transition-colors">oubrastore@gmail.com</a>
              </div>
            </div>

            <div className="luxury-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <FiPhone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Téléphone</h3>
                <p className="text-gray-400">+212 609 240 487</p>
              </div>
            </div>

            <div className="luxury-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <FiMapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Adresse</h3>
                <p className="text-gray-400">Maroc</p>
              </div>
            </div>

            <div className="luxury-card overflow-hidden rounded-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435522.0774584727!2d-7.8!3d33.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca!5e0!3m2!1sfr!2sma!4v1"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="luxury-card p-8 space-y-5"
          >
            <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet *" required className="input-luxury" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" required className="input-luxury" />
            </div>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="input-luxury" />
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Sujet *" required className="input-luxury" />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Votre message *" required rows={5} className="input-luxury resize-none" />
            <button type="submit" disabled={submitting} className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50">
              <FiSend className="w-4 h-4" />
              {submitting ? "Envoi..." : "Envoyer le message"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
