"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiTruck, FiGift, FiHeadphones, FiShield } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const advantages = [
  {
    icon: <FiTruck className="w-6 h-6" />,
    title: "Livraison Rapide",
    description: "Livraison offerte dès 799 DHS d'achats",
    color: "from-blue-500/15 to-blue-600/5",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: <FiGift className="w-6 h-6" />,
    title: "Offres Exclusives",
    description: "Des promotions uniques toute l'année",
    color: "from-purple-500/15 to-purple-600/5",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    icon: <FiHeadphones className="w-6 h-6" />,
    title: "Support 24/7",
    description: "Pour infos et questions contactez-nous",
    color: "from-green-500/15 to-green-600/5",
    iconColor: "text-green-500 dark:text-green-400",
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Paiement Sécurisé",
    description: "Transactions 100% sécurisées",
    color: "from-amber-500/15 to-amber-600/5",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
];

export default function AdvantagesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 lg:py-20 bg-gray-50/20 dark:bg-zinc-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Advantage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {advantages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative luxury-card p-8 text-center bg-white dark:bg-zinc-950 border border-black/[0.05] dark:border-white/[0.06] rounded-[28px] hover:border-primary-400/20 dark:hover:border-primary-400/20 hover:scale-[1.01]"
            >
              {/* Glowing Icon Frame */}
              <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center ${item.iconColor} group-hover:scale-110 group-hover:rotate-3 shadow-inner transition-all duration-500 border border-black/[0.03] dark:border-white/[0.05]`}>
                {item.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-[17px] font-display font-semibold text-gray-900 dark:text-zinc-100 mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-normal">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.06] rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-center gap-6 shadow-sm"
        >
          {/* WhatsApp Link */}
          <a
            href="https://wa.me/212609240487"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-all duration-300 hover:scale-102 font-medium"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">+212 609 240 487</span>
          </a>
          
          <span className="hidden sm:block w-px h-6 bg-black/[0.08] dark:bg-white/[0.08]" />
          
          {/* Email Link */}
          <a
            href="mailto:oubrastore@gmail.com"
            className="flex items-center gap-3 text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-300 transition-all duration-300 hover:scale-102 font-medium"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <span className="font-bold text-xs">@</span>
            </div>
            <span className="font-semibold text-sm">oubrastore@gmail.com</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
