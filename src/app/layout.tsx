// app/layout.tsx - CORRIGÉ avec AuthProvider structure
import "./globals.css";
import { Metadata } from 'next';
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Roboto, Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

// ✅ MÉTADONNÉES DE FALLBACK UNIQUEMENT (pas de données hardcodées spécifiques)
export async function generateMetadata(): Promise<Metadata> {
  return {
    // Métadonnées de base pour le fallback seulement
    metadataBase: new URL('https://gamerplace.ma'),
    
    // Titre de fallback générique (sera écrasé par les pages)
    title: {
      default: "Gamerplace.ma - PC Gaming & Composants Maroc",
      template: "%s | Gamerplace.ma"
    },
    
    // Description de fallback générique
    description: "Boutique PC Gaming au Maroc. Composants, PC Gamer, périphériques gaming.",
    
    // Métadonnées techniques
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Géolocalisation (conservée car applicable partout)
    other: {
      'geo.region': 'MA',
      'geo.placename': 'Casablanca',
      'geo.position': '33.5731;-7.5898',
      'ICBM': '33.5731, -7.5898',
    },
    
    // Open Graph de fallback
    openGraph: {
      type: 'website',
      siteName: 'Gamerplace.ma',
      locale: 'fr_MA',
      url: 'https://gamerplace.ma',
    },
    
    // Twitter de fallback
    twitter: {
      card: 'summary_large_image',
      site: '@gamerplacema',
    },
    
    // Optimisations techniques
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#000000',
    category: 'E-commerce',
    
    // Liens techniques
    alternates: {
      canonical: 'https://gamerplace.ma',
    },
    
    // Preconnect pour les performances
    icons: {
      icon: '/favicon.ico',
    },
  };
}

// ✅ Données structurées Schema.org (conservées car applicables globalement)
const structuredData = {
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ Preconnect pour les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ Données structurées globales */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      
      <body 
        style={{ fontFamily: 'Inter, sans-serif' }} 
        className="min-h-screen bg-gray-50 antialiased"
      >
        {/* ✅ STRUCTURE CORRIGÉE : AuthProvider en premier */}
        <AuthProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}