import HeroCarousel from "@/components/home/HeroCarousel";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import NewProductsSection from "@/components/home/NewProductsSection";
import PromotionsSection from "@/components/home/PromotionsSection";
import ActivitiesSection from "@/components/home/ActivitiesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AdvantagesSection />
      <NewProductsSection />
      <div className="section-divider max-w-7xl mx-auto" />
      <PromotionsSection />
      <ActivitiesSection />
      <div className="section-divider max-w-7xl mx-auto" />
      <TestimonialsSection />
    </>
  );
}
