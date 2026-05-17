export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price) + " DHS";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getDiscountedPrice(price: number, discountPercent: number): number {
  return price - (price * discountPercent) / 100;
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateOrderWhatsAppMessage(order: {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  shippingCost: number;
}): string {
  let msg = `🛒 *NOUVELLE COMMANDE - Oubra Store*\n\n`;
  msg += `👤 *Client:* ${order.fullName}\n`;
  msg += `📱 *Téléphone:* ${order.phone}\n`;
  msg += `🏙️ *Ville:* ${order.city}\n`;
  msg += `📍 *Adresse:* ${order.address}\n`;
  if (order.notes) msg += `📝 *Notes:* ${order.notes}\n`;
  msg += `\n📦 *Produits:*\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  order.items.forEach((item, i) => {
    msg += `${i + 1}. ${item.name}\n`;
    msg += `   Qté: ${item.quantity} × ${formatPrice(item.price)}\n`;
    msg += `   Sous-total: ${formatPrice(item.quantity * item.price)}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `📦 *Livraison:* ${formatPrice(order.shippingCost)}\n`;
  msg += `💰 *TOTAL:* ${formatPrice(order.totalAmount)}\n`;
  msg += `\n✅ Merci pour votre commande!`;
  return msg;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 30) return `Il y a ${days}j`;
  return new Date(date).toLocaleDateString("fr-FR");
}
