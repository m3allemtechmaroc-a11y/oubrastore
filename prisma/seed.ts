import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@oubra.com" },
    update: {},
    create: {
      email: "admin@oubra.com",
      password: adminPassword,
      name: "Admin Oubra",
      role: "ADMIN",
      phone: "+212609240487",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create categories
  const categoryData = [
    { name: "Papeterie", slug: "papeterie", description: "Tout pour la papeterie", orderIndex: 0 },
    { name: "Informatique", slug: "informatique", description: "Matériel informatique", orderIndex: 1 },
    { name: "Cartouche & Toner", slug: "cartouche-toner", description: "Cartouches et toners", orderIndex: 2 },
    { name: "Services Généraux", slug: "services-generaux", description: "Services généraux", orderIndex: 3 },
    { name: "Fourniture de Bureau", slug: "fourniture-de-bureau", description: "Fournitures de bureau", orderIndex: 4 },
    { name: "Tirage de Plan", slug: "tirage-de-plan", description: "Services de tirage de plan", orderIndex: 5 },
    { name: "Librairie", slug: "librairie", description: "Livres et manuels", orderIndex: 6 },
    { name: "Imprimerie", slug: "imprimerie", description: "Services d'impression", orderIndex: 7 },
  ];

  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created");

  // Fetch categories
  const categories = await prisma.category.findMany();
  const getCategoryId = (slug: string) => categories.find((c) => c.slug === slug)?.id;

  // Create sample products
  const products = [
    { name: "Stylo Bille BIC Cristal", slug: "stylo-bic-cristal", price: 5, stock: 500, categoryId: getCategoryId("papeterie"), isNew: true, images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80"] },
    { name: "Cahier Spirale A4 200 Pages", slug: "cahier-spirale-a4", price: 35, stock: 200, categoryId: getCategoryId("papeterie"), isNew: true, images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80"] },
    { name: "Ramette Papier A4 Navigator 500 Feuilles", slug: "ramette-papier-a4-navigator", price: 65, stock: 300, categoryId: getCategoryId("papeterie"), isPopular: true, images: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80"] },
    { name: "Calculatrice Casio FX-991ES", slug: "calculatrice-casio-fx991", price: 199, stock: 50, categoryId: getCategoryId("fourniture-de-bureau"), isNew: true, images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80"] },
    { name: "Souris Sans Fil Logitech M185", slug: "souris-logitech-m185", price: 149, stock: 75, categoryId: getCategoryId("informatique"), images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80"] },
    { name: "Clavier Sans Fil Logitech K380", slug: "clavier-logitech-k380", price: 299, stock: 40, categoryId: getCategoryId("informatique"), isPromotion: true, discountPercent: 15, compareAtPrice: 350, images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80"] },
    { name: "Cartouche HP 305 Noir Original", slug: "cartouche-hp-305-noir", price: 299, stock: 100, categoryId: getCategoryId("cartouche-toner"), isPopular: true, images: ["https://images.unsplash.com/photo-1563199284-752b07f17035?w=400&q=80"] },
    { name: "Toner HP LaserJet 85A", slug: "toner-hp-85a", price: 450, stock: 60, categoryId: getCategoryId("cartouche-toner"), images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80"] },
    { name: "Imprimante HP LaserJet Pro M404n", slug: "imprimante-hp-m404n", price: 2499, stock: 15, categoryId: getCategoryId("informatique"), isPromotion: true, discountPercent: 20, compareAtPrice: 3100, isFeatured: true, images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80"] },
    { name: "Pack Bureau Complet (Classeur + Stylos + Agrafeuse)", slug: "pack-bureau-complet", price: 199, stock: 30, categoryId: getCategoryId("fourniture-de-bureau"), isPromotion: true, discountPercent: 25, compareAtPrice: 265, images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80"] },
    { name: "Classeur à Levier A4", slug: "classeur-levier-a4", price: 25, stock: 150, categoryId: getCategoryId("fourniture-de-bureau"), images: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80"] },
    { name: "Livre Comptabilité Générale", slug: "livre-comptabilite", price: 85, stock: 40, categoryId: getCategoryId("librairie"), isNew: true, images: ["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80"] },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: `Produit de haute qualité - ${product.name}`,
      },
    });
  }
  console.log("✅ Products created");

  // Create default settings
  const defaultSettings = [
    { key: "whatsapp", value: "+212609240487" },
    { key: "email", value: "oubrastore@gmail.com" },
    { key: "phone", value: "+212609240487" },
    { key: "address", value: "Maroc" },
    { key: "shippingCost", value: "30" },
    { key: "minOrder", value: "100" },
    { key: "freeShippingMin", value: "799" },
    { key: "companyName", value: "Oubra Store" },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Settings created");

  // Create hero slides
  const heroSlides = [
    { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80", title: "Bienvenue chez Oubra Store", subtitle: "Votre partenaire en fournitures de bureau", buttonText: "Acheter maintenant", buttonLink: "/products", orderIndex: 0 },
    { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80", title: "Fournitures Professionnelles", subtitle: "Tout ce dont vous avez besoin", buttonText: "Voir produits", buttonLink: "/products", orderIndex: 1 },
    { image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&q=80", title: "Informatique & Technologie", subtitle: "Les meilleures marques", buttonText: "Découvrir", buttonLink: "/category/informatique", orderIndex: 2 },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log("✅ Hero slides created");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
