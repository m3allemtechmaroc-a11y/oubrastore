export const APP_NAME = "Oubra Store";
export const APP_DESCRIPTION = "Votre partenaire en fournitures de bureau, informatique, papeterie et services d'impression au Maroc.";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+212609240487";
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "oubrastore@gmail.com";
export const MIN_ORDER_AMOUNT = 100;
export const DEFAULT_SHIPPING_COST = 30;
export const CURRENCY = "DHS";

export const CATEGORIES = [
  { name: "Librairie", slug: "librairie", icon: "📚" },
  { name: "Informatique", slug: "informatique", icon: "💻" },
  { name: "Cartouche & Toner", slug: "cartouche-toner", icon: "🖨️" },
  { name: "Services Généraux", slug: "services-generaux", icon: "🔧" },
  { name: "Papeterie", slug: "papeterie", icon: "✏️" },
  { name: "Fourniture de Bureau", slug: "fourniture-de-bureau", icon: "🗂️" },
  { name: "Tirage de Plan", slug: "tirage-de-plan", icon: "📐" },
  { name: "Imprimerie", slug: "imprimerie", icon: "🖨️" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  CONFIRMED: "bg-blue-500/20 text-blue-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

export const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/products" },
  { label: "Papeterie", href: "/category/papeterie" },
  { label: "Informatique", href: "/category/informatique" },
  { label: "Imprimerie", href: "/category/imprimerie" },
  { label: "Contact", href: "/contact" },
];
