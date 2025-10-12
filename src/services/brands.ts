// services/brands.ts
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Brand } from '@/types/brand';
import { SerializedBrand } from '@/types/serialized';
import { toTimestamp, serializeBrand } from '@/utils/firebase-helpers';

// Récupérer les marques - RETOURNE SerializedBrand[]
export async function getBrands(categoryIds: string[]): Promise<SerializedBrand[]> {
  try {
    if (categoryIds.length === 0) {
      return [];
    }
    
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(
      query(
        productsRef, 
        where('categoryIds', 'array-contains-any', categoryIds), 
        where('isActive', '==', true)
      )
    );
    
    const brandIds = new Set<string>();
    productsSnapshot.docs.forEach(doc => {
      const brandId = doc.data().brandId;
      if (brandId) {
        brandIds.add(brandId);
      }
    });
    
    if (brandIds.size === 0) return [];
    
    // Récupérer toutes les marques et filtrer côté client
    const brandsRef = collection(db, 'brands');
    const allBrandsSnapshot = await getDocs(
      query(brandsRef, where('isActive', '==', true))
    );
    
    const filteredBrands = allBrandsSnapshot.docs
      .filter(doc => brandIds.has(doc.id))
      .map(doc => {
        const data = doc.data();
        const brand: Brand = {
          id: doc.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          logoUrl: data.logoUrl,
          websiteUrl: data.websiteUrl,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
          isActive: data.isActive,
          createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
          updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
        };
        // Sérialiser la marque
        return serializeBrand(brand);
      });
    
    // Trier par nom
    filteredBrands.sort((a, b) => a.name.localeCompare(b.name));
    
    return filteredBrands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}