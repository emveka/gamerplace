// services/categories.ts
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types/category';
import { Timestamp } from 'firebase/firestore';
import { SerializedCategoryWithChildren, CategoryWithChildren } from '@/types/serialized';
import { toTimestamp, serializeCategoryWithChildren } from '@/utils/firebase-helpers';

// Récupérer une catégorie par son slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const categoriesRef = collection(db, 'categories');
    const categoryQuery = query(
      categoriesRef, 
      where('slug', '==', slug), 
      where('isActive', '==', true),
      limit(1)
    );
    const categorySnapshot = await getDocs(categoryQuery);
    
    if (categorySnapshot.empty) {
      console.warn('🔍 Aucune catégorie trouvée pour le slug:', slug);
      return null;
    }
    
    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    
    // 🔥 DEBUG : Afficher toutes les données Firebase
    console.log('🔍 Données brutes Firebase pour', slug, ':', {
      description: categoryData.description,
      descriptionLongue: categoryData.descriptionLongue,
      keywords: categoryData.keywords,
      metaTitle: categoryData.metaTitle,
      metaDescription: categoryData.metaDescription
    });
    
    const category: Category = {
      id: categoryDoc.id,
      name: categoryData.name || '',
      slug: categoryData.slug || slug,
      description: categoryData.description || '',
      descriptionLongue: categoryData.descriptionLongue,
      imageUrl: categoryData.imageUrl,
      parentId: categoryData.parentId || null,
      level: categoryData.level || 0,
      path: categoryData.path || [],
      metaTitle: categoryData.metaTitle || `${categoryData.name} | Gamerplace.ma`,
      metaDescription: categoryData.metaDescription || `Découvrez ${categoryData.name} sur Gamerplace.ma`,
      keywords: categoryData.keywords || [],
      isActive: categoryData.isActive !== false,
      order: categoryData.order || 0,
      createdAt: categoryData.createdAt ? toTimestamp(categoryData.createdAt) : Timestamp.fromMillis(0),
      updatedAt: categoryData.updatedAt ? toTimestamp(categoryData.updatedAt) : Timestamp.fromMillis(0),
    };
    
    // 🔥 DEBUG : Vérifier les champs critiques
    console.log('🔍 Vérification des champs pour', category.name, ':', {
      hasDescription: !!category.description,
      hasDescriptionLongue: !!category.descriptionLongue,
      hasKeywords: category.keywords.length > 0,
      descriptionLongueLength: category.descriptionLongue?.length || 0,
      keywordsCount: category.keywords.length
    });
    
    return category;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
}

// Récupérer toutes les catégories enfants récursivement
export async function getAllChildCategories(parentCategoryId: string): Promise<string[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const allCategoriesSnapshot = await getDocs(query(categoriesRef, where('isActive', '==', true)));
    
    const allCategories = allCategoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        isActive: data.isActive,
        createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
        updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
        ...data
      };
    });
    
    // Fonction récursive pour trouver tous les enfants
    const findAllChildren = (parentId: string): string[] => {
      const directChildren = allCategories
        .filter(cat => cat.parentId === parentId)
        .map(cat => cat.id);
      
      const allChildren = [...directChildren];
      
      directChildren.forEach(childId => {
        const grandChildren = findAllChildren(childId);
        allChildren.push(...grandChildren);
      });
      
      return allChildren;
    };
    
    const allCategoryIds = [parentCategoryId];
    const childrenIds = findAllChildren(parentCategoryId);
    allCategoryIds.push(...childrenIds);
    
    return [...new Set(allCategoryIds)];
  } catch (error) {
    console.error('Error in getAllChildCategories:', error);
    return [parentCategoryId];
  }
}

// Récupérer la hiérarchie des catégories
export async function getCategoriesHierarchy(): Promise<SerializedCategoryWithChildren[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const allCategoriesSnapshot = await getDocs(
      query(categoriesRef, where('isActive', '==', true))
    );
    
    // Mapper toutes les catégories
    const allCategories = allCategoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        descriptionLongue: data.descriptionLongue,
        imageUrl: data.imageUrl,
        parentId: data.parentId || null,
        metaTitle: data.metaTitle || `${data.name} | Gamerplace.ma`,
        metaDescription: data.metaDescription || `Découvrez ${data.name}`,
        keywords: data.keywords || [],
        isActive: data.isActive !== false,
        order: data.order || 0,
        level: data.level || 0,
        path: data.path || [],
        children: [] as CategoryWithChildren[],
        createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
        updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
      } as CategoryWithChildren;
    });

    // Fonction pour construire l'arbre des enfants d'une catégorie
    const buildCategoryTree = (parentId: string): CategoryWithChildren[] => {
      const directChildren = allCategories
        .filter(cat => cat.parentId === parentId)
        .sort((a, b) => a.order - b.order);

      return directChildren.map(child => ({
        ...child,
        children: buildCategoryTree(child.id)
      }));
    };

    // Récupérer TOUTES les catégories racines (sans parent)
    const rootCategories = allCategories
      .filter(cat => !cat.parentId && cat.isActive === true)
      .sort((a, b) => a.order - b.order)
      .map(root => ({
        ...root,
        children: buildCategoryTree(root.id)
      }));

    // Sérialiser toutes les catégories
    return rootCategories.map(serializeCategoryWithChildren);
  } catch (error) {
    console.error('Error fetching categories hierarchy:', error);
    return [];
  }
}