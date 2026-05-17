"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/212609240487?text=Bonjour%20Oubra%20Store%2C%20je%20suis%20intéressé..."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Contacter sur WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-gray-900" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-gray-900 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Contactez-nous
      </span>
    </motion.a>
  );
}
