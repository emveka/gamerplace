// app/page.tsx - Avec récupération du champ mobileAlt
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Banner } from '@/components/ui/Banner';
import { ProductGridHomeCategory } from '@/components/product/ProductGridHomeCategory';

// Types pour les banners Firebase
interface FirebaseBanner {
  id: string;
  title: string;
  alt: string;
  mobileAlt?: string;        // ✅ Ajouté : Alt text pour mobile
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
  updatedAt: { seconds: number; nanoseconds: number } | null;
}

// ✅ Fonction mise à jour pour récupérer mobileAlt
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
        
        // ✅ NOUVEAU: Récupérer mobileAlt depuis Firebase
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
      {/* Banner principal avec ratios exacts */}
      <div className="max-w-[1500px] mx-auto pt-6">
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

      {/* Vos sections produits */}
      <ProductGridHomeCategory
        title="PC Gamer"
        categoryId="t0SePGqxSmOfmYZ2ea1X"
        categorySlug="pc-gamer"
        maxProducts={6}
        priority={true}
      />

      <ProductGridHomeCategory
        title="Cartes Graphiques"
        categoryId="LazrSiL0nF7yh8eVnvS5"
        categorySlug="cartes-graphiques"
        maxProducts={6}
        priority={false}
      />

      <ProductGridHomeCategory
        title="Processeurs"
        categoryId="MRisGslLF4oodGbHZU7A"
        categorySlug="processeurs"
        maxProducts={6}
        priority={false}
      />
    </div>
  );
}