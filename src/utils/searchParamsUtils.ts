// utils/searchParamsUtils.ts - Utilitaires pour gérer les paramètres de recherche
import { SearchParams } from '@/types/filters';

/**
 * Normalise une valeur qui peut être string ou string[] vers string | undefined
 */
export function getFirstValue(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0]?.trim() || undefined;
  return typeof value === 'string' ? value.trim() || undefined : undefined;
}

/**
 * Normalise les valeurs qui peuvent être string ou string[] vers string[]
 */
export function normalizeToArray(value: string | string[] | undefined): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.filter(v => v && typeof v === 'string' && v.trim());
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

/**
 * Convertit les searchParams Next.js (avec string | string[]) vers SearchParams normalisés
 */
export function normalizeSearchParams(searchParams: { [key: string]: string | string[] | undefined }): SearchParams {
  const normalized: SearchParams = {};
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      const firstValue = getFirstValue(value);
      if (firstValue) {
        normalized[key] = firstValue;
      }
    }
  });
  
  return normalized;
}

/**
 * Valide et nettoie les paramètres de recherche
 */
export function validateAndSanitizeSearchParams(searchParams: SearchParams): SearchParams {
  const sanitized: SearchParams = {};
  
  // Validation de la page
  const pageValue = getFirstValue(searchParams.page);
  if (pageValue) {
    const page = parseInt(pageValue);
    if (!isNaN(page) && page > 0) {
      sanitized.page = page.toString();
    }
  }
  
  // Validation du tri
  const sortValue = getFirstValue(searchParams.sort);
  if (sortValue) {
    const validSorts = ['newest', 'price-asc', 'price-desc', 'name-asc', 'name-desc'];
    if (validSorts.includes(sortValue)) {
      sanitized.sort = sortValue;
    }
  }
  
  // Validation de la marque
  const brandValue = getFirstValue(searchParams.brand);
  if (brandValue) {
    sanitized.brand = brandValue;
  }
  
  // Validation de la condition
  const conditionValue = getFirstValue(searchParams.condition);
  if (conditionValue) {
    const validConditions = ['new', 'used', 'refurbished'];
    if (validConditions.includes(conditionValue)) {
      sanitized.condition = conditionValue;
    }
  }
  
  // Validation de la gamme de prix
  const priceRangeValue = getFirstValue(searchParams.priceRange);
  if (priceRangeValue) {
    const priceRegex = /^\d+-\d+$/;
    if (priceRegex.test(priceRangeValue)) {
      const [min, max] = priceRangeValue.split('-').map(Number);
      if (min >= 0 && max > min) {
        sanitized.priceRange = priceRangeValue;
      }
    }
  }
  
  // Validation du stock
  const stockValue = getFirstValue(searchParams.stock);
  if (stockValue) {
    const validStock = ['in-stock', 'out-of-stock', 'pre-order'];
    if (validStock.includes(stockValue)) {
      sanitized.stock = stockValue;
    }
  }
  
  return sanitized;
}

/**
 * Construit une URL propre avec les paramètres donnés
 */
export function buildCleanUrl(slug: string, searchParams: SearchParams): string {
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && value !== '1' && !(key === 'page' && value === '1')) {
      // CORRECTION : Utiliser getFirstValue pour normaliser
      const normalizedValue = getFirstValue(value);
      if (normalizedValue) {
        params.set(key, normalizedValue);
      }
    }
  });
  
  const query = params.toString();
  return `/categories/${slug}${query ? `?${query}` : ''}`;
}

/**
 * Crée une URL avec les paramètres de recherche pour la pagination
 * CORRECTION COMPLÈTE : Gestion appropriée des types SearchParams
 */
export function createPaginationUrl(
  searchParams: SearchParams, 
  page: number, 
  baseUrl: string = ''
): string {
  try {
    const params = new URLSearchParams();
    
    // Ajouter tous les paramètres existants sauf 'page'
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value !== undefined && value !== null && value !== '') {
        // CORRECTION : Utiliser getFirstValue pour normaliser tous les types
        const normalizedValue = getFirstValue(value);
        if (normalizedValue) {
          params.set(key, normalizedValue);
        }
      }
    });
    
    // Ajouter le paramètre page seulement si > 1
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const query = params.toString();
    const finalUrl = `${baseUrl}${query ? `?${query}` : ''}`;
    
    return finalUrl;
  } catch (error) {
    console.error('Erreur lors de la création de l\'URL de pagination:', error);
    return `${baseUrl}?page=${page}`;
  }
}

/**
 * Vérifie si les paramètres ont été modifiés après nettoyage
 */
export function hasSearchParamsChanged(
  original: SearchParams, 
  sanitized: SearchParams
): boolean {
  // CORRECTION : Créer des objets simples pour la comparaison
  const originalSimple: Record<string, string> = {};
  const sanitizedSimple: Record<string, string> = {};
  
  Object.entries(original).forEach(([key, value]) => {
    const normalizedValue = getFirstValue(value);
    if (normalizedValue) {
      originalSimple[key] = normalizedValue;
    }
  });
  
  Object.entries(sanitized).forEach(([key, value]) => {
    const normalizedValue = getFirstValue(value);
    if (normalizedValue) {
      sanitizedSimple[key] = normalizedValue;
    }
  });
  
  const originalUrl = new URLSearchParams(originalSimple).toString();
  const sanitizedUrl = new URLSearchParams(sanitizedSimple).toString();
  return originalUrl !== sanitizedUrl;
}