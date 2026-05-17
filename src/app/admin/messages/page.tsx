"use client";

import { useState, useEffect } from "react";
import { FiMail, FiCheck, FiTrash2 } from "react-icons/fi";
import { timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

interface Message { id: string; name: string; email: string; phone: string | null; subject: string; message: string; isRead: boolean; createdAt: string }

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/contacts").then((r) => r.json()).then((d) => { if (d.success) setMessages(d.data); }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
        <span className="text-gradient-gold">Messages</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />) :
          messages.length === 0 ? <div className="text-center py-8 text-gray-400">Aucun message</div> :
          messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left p-4 rounded-xl transition-all ${selected?.id === msg.id ? "bg-primary-400/10 border border-primary-400/20" : "bg-gray-100/50 hover:bg-gray-100 border border-transparent"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900 text-sm truncate">{msg.name}</p>
                <span className="text-xs text-gray-400">{timeAgo(new Date(msg.createdAt))}</span>
              </div>
              <p className="text-xs text-primary-400 truncate">{msg.subject}</p>
              <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
            </button>
          ))}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{selected.subject}</h2>
                <span className="text-xs text-gray-400">{timeAgo(new Date(selected.createdAt))}</span>
              </div>
              <div className="space-y-2 mb-6 text-sm">
                <p className="text-gray-400">De: <span className="text-gray-900">{selected.name}</span></p>
                <p className="text-gray-400">Email: <span className="text-primary-400">{selected.email}</span></p>
                {selected.phone && <p className="text-gray-400">Tél: <span className="text-gray-900">{selected.phone}</span></p>}
              </div>
              <div className="p-4 bg-gray-100/50 rounded-xl">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`mailto:${selected.email}`} className="btn-gold text-sm flex items-center gap-2"><FiMail className="w-4 h-4" /> Répondre</a>
                <a href={`https://wa.me/${selected.phone?.replace(/\D/g, "")}`} target="_blank" className="btn-outline-gold text-sm">WhatsApp</a>
              </div>
            </div>
          ) : (
            <div className="admin-card flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <FiMail className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                <p>Sélectionnez un message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
