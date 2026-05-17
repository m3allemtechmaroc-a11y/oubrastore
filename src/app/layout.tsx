import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Oubra Store | Fournitures de Bureau & Services d'Impression au Maroc",
  description: "Votre partenaire en fournitures de bureau, informatique, papeterie, cartouches, toner et services d'impression professionnels au Maroc. Livraison rapide et prix compétitifs.",
  keywords: "fournitures de bureau, papeterie, informatique, imprimerie, cartouche, toner, Maroc, Oubra Store",
  openGraph: {
    title: "Oubra Store | Fournitures de Bureau & Services d'Impression",
    description: "Votre partenaire en fournitures de bureau et services d'impression au Maroc.",
    type: "website",
    locale: "fr_MA",
    siteName: "Oubra Store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#fff",
              border: "1px solid rgba(255, 215, 0, 0.15)",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#FFD700", secondary: "#0A0A0A" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
