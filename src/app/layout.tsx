// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { SEODebug } from "@/components/debug/SEODebug"; // Ajout du composant debug
import {  Roboto, Inter, } from 'next/font/google'


export const metadata: Metadata = {
  title: "PC Gamers, Cartes Graphiques, Matériels Gamings - Gamerplace.ma",
  description: "Découvrez la plus grande sélection de produits gaming au Maroc sur Gamerplace.ma",
  keywords: "gaming, jeux vidéo, consoles, PC gaming, Maroc, Casablanca",
  authors: [{ name: 'Gamerplace.ma' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Gamerplace.ma - Votre boutique gaming au Maroc',
    description: 'Découvrez la plus grande sélection de produits gaming au Maroc',
    url: 'https://gamerplace.ma',
    siteName: 'Gamerplace.ma',
    locale: 'fr_MA',
  },
};

const inter = Inter({
  subsets: ['latin'],
})

const roboto = Roboto({
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'inter, sans-serif' }} className="min-h-screen bg-gray-50">
        <Header />
        <NavigationMenu />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer pourra être ajouté ici plus tard */}
        <footer className="bg-black text-white py-8 mt-auto">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-400">© 2024 Gamerplace.ma - Tous droits réservés</p>
            </div>
          </div>
        </footer>

        {/* Composant de debug SEO - Visible seulement en développement */}
        <SEODebug />
      </body>
    </html>
  );
}