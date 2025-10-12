// app/page.tsx - CORRIGÉ avec generateMetadata optimisé SEO
import { Metadata } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Banner } from '@/components/ui/Banner';
import { ProductGridHomeCategory } from '@/components/product/ProductGridHomeCategory';
import { SEOPageHome } from '@/components/seo/SEOPageHome';

// Types pour les banners Firebase
interface FirebaseBanner {
  id: string;
  title: string;
  alt: string;
  mobileAlt?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
  updatedAt: { seconds: number; nanoseconds: number } | null;
}

// ✅ NOUVELLES MÉTADONNÉES OPTIMISÉES POUR LA PAGE D'ACCUEIL
export async function generateMetadata(): Promise<Metadata> {
  return {
    // ✅ Titre optimisé pour le SEO principal
    title: "PC Gamer Maroc - Ordinateurs Gaming Haute Performance | Gamerplace.ma",
    
    // ✅ Description optimisée avec mots-clés principaux
    description: "Découvrez la plus grande sélection de PC Gamer au Maroc chez Gamerplace.ma. Composants gaming, cartes graphiques RTX, processeurs AMD & Intel. Livraison partout au Maroc.",
    
    // ✅ Mots-clés SEO stratégiques pour la page d'accueil
    keywords: "PC Gamer Maroc, carte graphique RTX Maroc, processeur gaming Maroc, PC gaming Casablanca, composants gaming Maroc, RTX 4060 Maroc, AMD Ryzen Maroc, Intel Core gaming, boutique gaming Casablanca, PC Gamer pas cher Maroc",
    
    authors: [{ name: 'Gamerplace.ma' }],
    creator: 'Gamerplace.ma',
    publisher: 'Gamerplace.ma',
    
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
    
    // ✅ Géo-localisation pour le SEO local
    other: {
      'geo.region': 'MA',
      'geo.placename': 'Casablanca',
      'geo.position': '33.5731;-7.5898',
      'ICBM': '33.5731, -7.5898',
    },
    
    alternates: {
      canonical: 'https://gamerplace.ma',
      languages: {
        'fr-MA': 'https://gamerplace.ma',
        'ar-MA': 'https://gamerplace.ma/ar',
      },
    },
    
    // ✅ Open Graph optimisé pour la page d'accueil
    openGraph: {
      type: 'website',
      title: 'PC Gamer Maroc - Cartes Graphiques RTX, Processeurs Gaming | Gamerplace.ma',
      description: 'La référence PC Gamer au Maroc. Cartes graphiques RTX, processeurs AMD & Intel. Livraison partout au Maroc. Prix imbattables !',
      url: 'https://gamerplace.ma',
      siteName: 'Gamerplace.ma',
      locale: 'fr_MA',
      images: [{
        url: 'https://gamerplace.ma/images/og-pc-gamer-maroc.jpg',
        width: 1200,
        height: 630,
        alt: 'PC Gamer Maroc - Gamerplace.ma',
        type: 'image/jpeg',
      }],
    },
    
    // ✅ Twitter Cards pour la page d'accueil
    twitter: {
      card: 'summary_large_image',
      title: 'PC Gamer Maroc - Gamerplace.ma',
      description: '🎮 PC Gamer & composants gaming au Maroc. RTX, AMD, Intel. Livraison rapide.',
      images: ['https://gamerplace.ma/images/twitter-pc-gamer-maroc.jpg'],
      site: '@gamerplacema',
    },
    
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#000000',
    category: 'E-commerce',
    
    // ✅ Données structurées spécifiques à la page d'accueil
    verification: {
      google: 'your-google-verification-code', // À remplacer par votre code
    },
  };
}

async function getBanners(): Promise<FirebaseBanner[]> {
  try {
    const bannersRef = collection(db, 'banners');
    const snapshot = await getDocs(bannersRef);
    
    if (snapshot.empty) return [];

    const banners = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        alt: data.alt || '',
        mobileAlt: data.mobileAlt || undefined,
        imageUrl: data.imageUrl || '',
        mobileImageUrl: data.mobileImageUrl || undefined,
        linkUrl: data.linkUrl || '',
        isActive: data.isActive !== false,
        order: data.order || 0,
        createdAt: data.createdAt ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds
        } : null,
        updatedAt: data.updatedAt ? {
          seconds: data.updatedAt.seconds,
          nanoseconds: data.updatedAt.nanoseconds
        } : null
      };
    });

    return banners
      .filter(banner => banner.isActive)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Erreur banners:', error);
    return [];
  }
}

export default async function HomePage() {
  const banners = await getBanners();

  return (
    <div className="w-full bg-white">
      {/* ✅ H1 Principal - Critique pour le SEO */}
      <div className="max-w-[1500px] mx-auto px-4 pt-4 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
          PC Gamer Maroc - Ordinateurs Gaming Haute Performance
        </h1>
        <p className="text-gray-600 text-center text-sm md:text-base max-w-3xl mx-auto">
          Découvrez la plus grande sélection de PC Gamer au Maroc chez Gamerplace.ma. 
          Composants gaming, cartes graphiques RTX, processeurs AMD & Intel. Livraison partout au Maroc.
        </p>
      </div>

      {/* Banner principal */}
      <div className="max-w-[1500px] mx-auto pt-4">
        <Banner
          banners={banners}
          autoplay={true}
          autoplayDelay={5000}
          showDots={true}
          showMobileDots={false}
          showProgressBar={true}
          debug={false}
        />
      </div>

      {/* ✅ Sections produits avec H2 optimisés SEO */}
      <ProductGridHomeCategory
        title="PC Gamer Complets au Maroc"
        categoryId="t0SePGqxSmOfmYZ2ea1X"
        categorySlug="pc-gamer"
        maxProducts={6}
        priority={true}
      />

      <ProductGridHomeCategory
        title="Cartes Graphiques Gaming RTX & Radeon"
        categoryId="LazrSiL0nF7yh8eVnvS5"
        categorySlug="cartes-graphiques"
        maxProducts={6}
        priority={false}
      />

      <ProductGridHomeCategory
        title="Processeurs Gaming AMD & Intel"
        categoryId="MRisGslLF4oodGbHZU7A"
        categorySlug="processeurs"
        maxProducts={6}
        priority={false}
      />

      {/* Section SEO structurée */}
      <SEOPageHome />
    </div>
  );
}