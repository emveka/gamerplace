// app/products/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';
import { serializeProduct, SerializedProduct } from '@/utils/serialization';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductDescriptionSections } from '@/components/product/ProductDescriptionSections';
import { ProductVideoPlayer } from '@/components/product/ProductVideoPlayer';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Suspense } from 'react';
// 🆕 Import du nouveau composant ProductSpecinfo (attention à la casse exacte)
import { ProductSpecinfo } from '@/components/product/ProductSpecInfo';

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

// Récupérer un produit par son slug
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const productsRef = collection(db, 'products');
    const productQuery = query(
      productsRef,
      where('slug', '==', slug),
      where('isActive', '==', true),
      limit(1)
    );
    
    const productSnapshot = await getDocs(productQuery);
    
    if (productSnapshot.empty) {
      return null;
    }
    
    const productDoc = productSnapshot.docs[0];
    const data = productDoc.data();
    
    return {
      id: productDoc.id,
      title: data.title || '',
      slug: data.slug || '',
      shortDescription: data.shortDescription,
      description: data.description,
      brandId: data.brandId || '',
      brandName: data.brandName || '',
      categoryIds: data.categoryIds || [],
      categoryPath: data.categoryPath || [],
      primaryCategoryId: data.primaryCategoryId || '',
      primaryCategoryName: data.primaryCategoryName || '',
      price: data.price || 0,
      oldPrice: data.oldPrice || undefined, // 🔧 Convertir null en undefined
      costPrice: data.costPrice,
      images: data.images || [],
      imageAlts: data.imageAlts || [],
      stock: data.stock || 0,
      sku: data.sku,
      barcode: data.barcode,
      specifications: data.specifications || {},
      // 🆕 Récupération des informations techniques
      technicalInfo: data.technicalInfo || {},
      tags: data.tags || [],
      badges: data.badges || [],
      productDescriptions: data.productDescriptions || [],
      videoUrl: data.videoUrl,
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      keywords: data.keywords || [],
      canonicalUrl: data.canonicalUrl,
      isActive: data.isActive !== false,
      isNewArrival: data.isNewArrival || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Construire le breadcrumb
function buildProductBreadcrumb(product: Product): BreadcrumbItem[] {
  const breadcrumbItems: BreadcrumbItem[] = [
    { href: '/', label: 'Accueil' },
    { href: '/products', label: 'Produits' }
  ];

  if (product.primaryCategoryName && product.primaryCategoryId) {
    breadcrumbItems.push({
      href: `/categories/${product.primaryCategoryId}`,
      label: product.primaryCategoryName
    });
  }

  breadcrumbItems.push({
    href: `/products/${product.slug}`,
    label: product.title,
    current: true
  });

  return breadcrumbItems;
}

// Génération des métadonnées
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Produit non trouvé | Gamerplace.ma',
      description: 'Ce produit n\'existe pas sur Gamerplace.ma.',
      robots: 'noindex, nofollow',
    };
  }

  const mainImage = product.images?.[0];

  return {
    title: product.metaTitle || `${product.title} | Gamerplace.ma`,
    description: product.metaDescription || product.shortDescription || `Découvrez ${product.title} sur Gamerplace.ma`,
    keywords: product.keywords?.join(', '),
    robots: 'index, follow',
    alternates: {
      canonical: product.canonicalUrl || `https://gamerplace.ma/products/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      title: product.metaTitle || product.title,
      description: product.metaDescription || product.shortDescription || '',
      url: `https://gamerplace.ma/products/${product.slug}`,
      siteName: 'Gamerplace.ma',
      images: mainImage ? [{
        url: mainImage,
        width: 1200,
        height: 630,
        alt: product.imageAlts?.[0] || product.title,
      }] : [],
      locale: 'fr_MA',
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'MAD',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:brand': product.brandName,
      'product:condition': 'new',
    }
  };
}

// Composant principal
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const serializedProduct = serializeProduct(product);
  const breadcrumbItems = buildProductBreadcrumb(product);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1500px] mx-auto px-4 py-1">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Section principale du produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Galerie d'images */}
          <div className="space-y-4">
            <ProductImageGallery
              images={product.images}
              imageAlts={product.imageAlts}
              productTitle={product.title}
            />
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <ProductInfo product={serializedProduct} />
          </div>
        </div>

        {/* Banner Service Nettoyage PC Gamer */}
        <div className="mb-12">
          <img 
            src="/images/BannerNettoyagePcgamer.webp" 
            alt="Service Nettoyage PC Gamer" 
            className="w-full "
          />
        </div>

        {/* 🆕 Spécifications techniques avec vraies données Firebase */}
        <div className="mb-12">
          <ProductSpecinfo product={serializedProduct} />
        </div>

        {/* Sections de description détaillées */}
        {product.productDescriptions && product.productDescriptions.length > 0 && (
          <div className="mb-12">
            <ProductDescriptionSections descriptions={product.productDescriptions} />
          </div>
        )}

        {/* Lecteur vidéo YouTube - Toujours affiché */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-yellow-500 pl-4">
            Vidéo du produit
          </h2>
          <ProductVideoPlayer 
            videoUrl={product.videoUrl} 
            productTitle={product.title}
          />
        </div>

        {/* Produits similaires */}
        <Suspense fallback={
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-yellow-500 pl-4">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg border border-gray-200"></div>
              ))}
            </div>
          </div>
        }>
          <RelatedProducts 
            categoryIds={product.categoryIds}
            currentProductId={product.id}
            brandId={product.brandId}
          />
        </Suspense>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;