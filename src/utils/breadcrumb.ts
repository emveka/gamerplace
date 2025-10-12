// utils/breadcrumb.ts
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types/category';
import { BreadcrumbItem } from '@/types/filters';
import { toTimestamp } from '@/utils/firebase-helpers';
import { Timestamp } from 'firebase/firestore';

// Construire le breadcrumb avec toute la hiérarchie des catégories
export async function buildCategoryBreadcrumb(category: Category): Promise<BreadcrumbItem[]> {
  const breadcrumbItems: BreadcrumbItem[] = [
    { href: '/', label: 'Accueil' }
  ];

  // Récupérer récursivement tous les parents
  const categoryHierarchy: Category[] = [];
  let currentCategory = category;

  // Remonter la hiérarchie jusqu'à la racine
  while (currentCategory) {
    categoryHierarchy.unshift(currentCategory);
    
    if (currentCategory.parentId) {
      try {
        const categoriesRef = collection(db, 'categories');
        const allCategoriesSnapshot = await getDocs(
          query(categoriesRef, where('isActive', '==', true))
        );
        
        // Trouver le parent par son ID
        const parentDoc = allCategoriesSnapshot.docs.find(doc => doc.id === currentCategory.parentId);
        
        if (parentDoc) {
          const parentData = parentDoc.data();
          currentCategory = {
            id: parentDoc.id,
            name: parentData.name,
            slug: parentData.slug,
            description: parentData.description,
            parentId: parentData.parentId,
            imageUrl: parentData.imageUrl,
            metaTitle: parentData.metaTitle,
            metaDescription: parentData.metaDescription,
            keywords: parentData.keywords,
            isActive: parentData.isActive,
            order: parentData.order,
            createdAt: parentData.createdAt ? toTimestamp(parentData.createdAt) : Timestamp.fromMillis(0),
            updatedAt: parentData.updatedAt ? toTimestamp(parentData.updatedAt) : Timestamp.fromMillis(0),
          } as Category;
        } else {
          break;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du parent:', error);
        break;
      }
    } else {
      break;
    }
  }

  // Construire le breadcrumb à partir de la hiérarchie
  categoryHierarchy.forEach((cat, index) => {
    const isLast = index === categoryHierarchy.length - 1;
    breadcrumbItems.push({
      href: `/categories/${cat.slug}`,
      label: cat.name,
      current: isLast
    });
  });

  return breadcrumbItems;
}