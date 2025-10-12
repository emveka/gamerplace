// app/layout.tsx - Métadonnées SEO optimisées
"use client";


import "./globals.css";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from "@/components/layout/Header";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { SearchBarSticky } from "@/components/ui/SearchBarSticky";
import { SEODebug } from "@/components/debug/SEODebug";
import { Roboto, Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fonction pour ouvrir/fermer le menu mobile (toggle)
  const handleMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Fonction pour fermer uniquement le menu mobile
  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Fonction de recherche personnalisée
  const handleSearch = (query: string) => {
    // Fermer le menu mobile si ouvert lors de la recherche
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // Redirection vers la page de recherche
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  // Fermer le menu mobile quand on redimensionne vers desktop
  useEffect(() => {
    const handleResize = () => {
      // Si on passe en mode desktop (>= 1024px), fermer le menu mobile
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Sauvegarder la position de scroll actuelle
      const scrollY = window.scrollY;
      
      // Bloquer le scroll et maintenir la position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer le scroll normal
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restaurer la position de scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup au démontage
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Fermer le menu mobile avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* ✅ Titre SEO optimisé pour PC Gamer Maroc */}
        <title>PC Gamer Maroc - Cartes Graphiques RTX, Processeurs Gaming | Gamerplace.ma</title>
        
        {/* ✅ Meta description optimisée avec mots-clés principaux */}
        <meta name="description" content="PC Gamer Maroc chez Gamerplace.ma, Cartes graphiques GTRX, RTX, RX, CPU AMD Ryzen & Intel, Moniteurs, Livraison rapide au Maroc à Casablanca, Rabat, Marrakech" />
        
        {/* ✅ Mots-clés SEO stratégiques */}
        <meta name="keywords" content="PC Gamer Maroc, carte graphique RTX Maroc, processeur gaming Maroc, PC gaming Casablanca, composants gaming Maroc, RTX 5060 Maroc, AMD Ryzen Maroc, Intel Core gaming, boutique gaming Casablanca, PC Gamer pas cher Maroc" />
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Gamerplace.ma" />
        
        {/* ✅ Balises géo-localisées pour le SEO local */}
        <meta name="geo.region" content="MA" />
        <meta name="geo.placename" content="Casablanca" />
        <meta name="geo.position" content="33.5731;-7.5898" />
        <meta name="ICBM" content="33.5731, -7.5898" />
        
        {/* ✅ Open Graph optimisé */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PC Gamer Maroc - Cartes Graphiques RTX, Processeurs Gaming | Gamerplace.ma" />
        <meta property="og:description" content="La référence PC Gamer au Maroc. Cartes graphiques RTX, processeurs AMD & Intel. Livraison partout au Maroc. Prix imbattables !" />
        <meta property="og:url" content="https://gamerplace.ma" />
        <meta property="og:site_name" content="Gamerplace.ma" />
        <meta property="og:locale" content="fr_MA" />
        <meta property="og:image" content="https://gamerplace.ma/images/og-pc-gamer-maroc.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="PC Gamer Maroc - Gamerplace.ma" />
        
        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PC Gamer Maroc - Gamerplace.ma" />
        <meta name="twitter:description" content="🎮 PC Gamer & composants gaming au Maroc. RTX, AMD, Intel. Livraison rapide." />
        <meta name="twitter:image" content="https://gamerplace.ma/images/twitter-pc-gamer-maroc.jpg" />
        
        {/* ✅ Données structurées pour le SEO local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Gamerplace.ma",
              "description": "Boutique spécialisée PC Gamer et composants gaming au Maroc",
              "url": "https://gamerplace.ma",
              "logo": "https://gamerplace.ma/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Casablanca",
                "addressCountry": "MA"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "33.5731",
                "longitude": "-7.5898"
              },
              "areaServed": ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir"],
              "priceRange": "$$",
              "category": "Boutique Gaming",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "PC Gamer et Composants Gaming",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "PC Gamer complets",
                      "category": "Ordinateurs Gaming"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Cartes Graphiques RTX",
                      "category": "Composants Gaming"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Processeurs AMD & Intel",
                      "category": "Processeurs Gaming"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {/* ✅ Preconnect pour les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ Canonical URL */}
        <link rel="canonical" href="https://gamerplace.ma" />
        
        {/* ✅ Hreflang pour le SEO international (optionnel) */}
        <link rel="alternate" hrefLang="fr-ma" href="https://gamerplace.ma" />
        <link rel="alternate" hrefLang="ar-ma" href="https://gamerplace.ma/ar" />
      </head>
      
      <body 
        style={{ fontFamily: 'Inter, sans-serif' }} 
        className="min-h-screen bg-gray-50 antialiased"
      >
        {/* Header avec SearchBar intégrée (desktop) + bouton hamburger */}
        <Header 
          onSearch={handleSearch}
          onMenuToggle={handleMenuToggle}
          isMenuOpen={isMobileMenuOpen}
        />

        {/* SearchBar sticky mobile - Visible uniquement sur mobile/tablette */}
        <SearchBarSticky onSearch={handleSearch} />

        {/* Navigation Menu avec gestion mobile */}
        <NavigationMenu 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMenuClose}
        />

        {/* Overlay sombre pour fermer le menu sur mobile */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0  bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={handleMenuClose}
            aria-label="Fermer le menu"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMenuClose();
              }
            }}
          />
        )}

        {/* Contenu principal */}
        <main 
          className={`relative transition-all duration-300 ${
            isMobileMenuOpen ? 'lg:opacity-100 opacity-50' : 'opacity-100'
          }`}
          style={{
            pointerEvents: isMobileMenuOpen ? 'none' : 'auto',
            minHeight: '100vh'
          }}
        >
          {children}
        </main>

        {/* Footer amélioré */}
        <footer className="bg-black text-white py-8 mt-auto">
          <div className="max-w-[1500px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Informations de la boutique */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-yellow-400 mb-4">
                  Gamerplace.ma
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Votre destination gaming au Maroc. Découvrez les derniers PC gaming, 
                  composants, périphériques et consoles aux meilleurs prix.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>📍 Casablanca, Maroc</p>
                  <p>📞 +212 XX XX XX XX</p>
                  <p>✉️ contact@gamerplace.ma</p>
                </div>
              </div>

              {/* Liens rapides */}
              <div>
                <h4 className="text-md font-semibold text-white mb-4">
                  Liens Rapides
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <Link href="/categories/pc-gamer" className="hover:text-yellow-400 transition-colors">
                      PC Gamers
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/composants" className="hover:text-yellow-400 transition-colors">
                      Composants
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/peripheriques" className="hover:text-yellow-400 transition-colors">
                      Périphériques
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/consoles" className="hover:text-yellow-400 transition-colors">
                      Consoles
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-md font-semibold text-white mb-4">
                  Support
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <Link href="/support/contact" className="hover:text-yellow-400 transition-colors">
                      Nous Contacter
                    </Link>
                  </li>
                  <li>
                    <Link href="/support/faq" className="hover:text-yellow-400 transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/support/livraison" className="hover:text-yellow-400 transition-colors">
                      Livraison
                    </Link>
                  </li>
                  <li>
                    <Link href="/support/retour" className="hover:text-yellow-400 transition-colors">
                      Retours
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Ligne de séparation */}
            <hr className="border-gray-700 my-6" />

            {/* Copyright et réseaux sociaux */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Gamerplace.ma - Tous droits réservés
              </p>
              
              {/* Réseaux sociaux */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Composant de debug SEO - Visible seulement en développement */}
        <SEODebug />
      </body>
    </html>
  );
}