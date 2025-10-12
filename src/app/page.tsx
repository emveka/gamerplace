// app/page.tsx - Optimisé SEO pour "PC Gamer au Maroc"
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
      {/* H1 Principal - Critique pour le SEO */}
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

      {/* Sections produits avec H2 optimisés */}
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