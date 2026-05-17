"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Magnetic from "@/components/ui/Magnetic";

const defaultSlides = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=80",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&q=80",
  },
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Dynamic fetch of Carousel Slides from the Database API
  useEffect(() => {
    const fetchDynamicSlides = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (err) {
        console.error("Failed to load slides from DB:", err);
      }
    };
    fetchDynamicSlides();
  }, []);

  // Timer loop for dynamic carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  
  const prev = () => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;
  const slide = slides[current];

  // Satisfying spring sliding variants
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative w-full aspect-[2.1/1] sm:aspect-[2.3/1] md:aspect-[2.6/1] lg:aspect-[2.9/1] xl:aspect-[3.2/1] overflow-hidden bg-white dark:bg-zinc-950 mt-16 lg:mt-20">
      
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={slide.id || current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 100, damping: 18, mass: 0.5 }}
          className="absolute inset-0 overflow-hidden"
        >
          {/* Full-width and responsive aspect-ratio banner image (no black borders, no side margins, no empty spaces) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-[1.01]"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows with Magnetic physics */}
      {slides.length > 1 && (
        <>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Magnetic range={50} strength={0.3}>
              <button
                onClick={prev}
                className="w-9 h-9 sm:w-11 sm:h-11 bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.06] rounded-full flex items-center justify-center text-gray-800 dark:text-zinc-200 hover:text-primary-500 shadow-sm transition-all"
                aria-label="Précédent"
              >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Magnetic>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Magnetic range={50} strength={0.3}>
              <button
                onClick={next}
                className="w-9 h-9 sm:w-11 sm:h-11 bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.06] rounded-full flex items-center justify-center text-gray-800 dark:text-zinc-200 hover:text-primary-500 shadow-sm transition-all"
                aria-label="Suivant"
              >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Magnetic>
          </div>
        </>
      )}

      {/* Satisfying Slide Indicator Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === current ? 20 : 8,
                backgroundColor: i === current ? "rgb(245, 158, 11)" : "rgba(255, 255, 255, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="h-2 rounded-full shadow-sm"
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
