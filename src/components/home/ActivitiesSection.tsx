"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const activities = [
  { title: "Librairie", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", slug: "librairie" },
  { title: "Informatique", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80", slug: "informatique" },
  { title: "Cartouche & Toner", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80", slug: "cartouche-toner" },
  { title: "Services Généraux", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&q=80", slug: "services-generaux" },
  { title: "Papeterie", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80", slug: "papeterie" },
  { title: "Fourniture de Bureau", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", slug: "fourniture-de-bureau" },
  { title: "Tirage de Plan", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80", slug: "tirage-de-plan" },
  { title: "Imprimerie", image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=80", slug: "imprimerie" },
];

export default function ActivitiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-28 relative overflow-hidden bg-gray-50/50 dark:bg-zinc-950/20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary-500 dark:text-primary-400 text-xs font-bold uppercase tracking-widest bg-primary-500/10 px-3.5 py-1.5 rounded-full">
            Ce que nous faisons
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-gray-900 dark:text-zinc-100 mt-5">
            Nos <span className="bg-gradient-to-r from-primary-400 to-amber-500 bg-clip-text text-transparent">Activités</span>
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-4 max-w-2xl mx-auto text-[15px] sm:text-base leading-relaxed">
            Découvrez notre gamme complète de services et produits professionnels adaptés à vos besoins
          </p>
        </motion.div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/category/${activity.slug}`}
                className="group block relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 border border-black/[0.04] dark:border-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {/* Background Image */}
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                
                {/* Modern Dark Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:via-black/50 transition-all duration-500" />
                
                {/* Elegant Glassy Bottom Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div className="bg-black/35 dark:bg-zinc-950/45 border border-white/10 backdrop-blur-md rounded-[20px] p-4 transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50">
                    <h3 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-primary-400 transition-colors duration-300 leading-snug">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-primary-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                      <span>Découvrir</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
