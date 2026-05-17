"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiStar, FiUser } from "react-icons/fi";

const testimonials = [
  { name: "Ahmed B.", role: "Directeur, Cabinet ABC", text: "Service exceptionnel et livraison rapide. Oubra Store est notre fournisseur principal pour toutes nos fournitures de bureau.", rating: 5 },
  { name: "Fatima Z.", role: "Enseignante", text: "Très satisfaite de la qualité des produits et des prix compétitifs. Je recommande vivement Oubra Store.", rating: 5 },
  { name: "Mohammed K.", role: "Architecte", text: "Le service de tirage de plan est excellent. Qualité professionnelle et délais respectés à chaque fois.", rating: 4 },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 relative overflow-hidden bg-white/50 dark:bg-zinc-950/10">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary-500 dark:text-primary-400 text-xs font-bold uppercase tracking-widest bg-primary-500/10 px-3.5 py-1.5 rounded-full">
            Témoignages
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-gray-900 dark:text-zinc-100 mt-5">
            Ce que disent nos <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">clients</span>
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-4 max-w-2xl mx-auto text-[15px] sm:text-base leading-relaxed">
            La satisfaction de nos clients professionnels et particuliers est notre plus belle réussite
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative luxury-card p-8 flex flex-col justify-between h-full bg-white dark:bg-zinc-950 border border-black/[0.05] dark:border-white/[0.06] rounded-[28px] hover:border-primary-400/20 dark:hover:border-primary-400/20 hover:scale-[1.01]"
            >
              {/* Floating Quote Accent */}
              <span className="absolute top-6 right-8 text-black/[0.03] dark:text-white/[0.03] text-7xl font-serif pointer-events-none select-none group-hover:text-primary-500/10 transition-colors duration-500">
                “
              </span>

              <div>
                {/* Gold Rating Stars */}
                <div className="flex items-center gap-1.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                        i < item.rating 
                          ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_3px_rgba(245,158,11,0.2)]" 
                          : "text-gray-200 dark:text-zinc-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 dark:text-zinc-300 text-[14px] sm:text-[15px] leading-relaxed font-normal italic mb-8">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* User Identity Details */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary-400 to-amber-500 p-[2px] flex items-center justify-center shadow-md">
                  <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-primary-500 dark:text-primary-400 font-bold">
                    <FiUser className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-zinc-100 font-bold text-[14px]">{item.name}</p>
                  <p className="text-gray-400 dark:text-zinc-500 text-xs font-semibold mt-0.5">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
