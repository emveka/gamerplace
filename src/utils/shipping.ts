// utils/shipping.ts - Configuration Cathedis Maroc
export interface ShippingCity {
  name: string;
  code: string;
  price: number;
  deliveryTime: string;
  region: string;
}

// Tarifs de livraison Cathedis par ville (à ajuster selon vos tarifs réels)
export const SHIPPING_CITIES: ShippingCity[] = [
  // Grandes villes - Livraison rapide
  { name: 'Casablanca', code: 'casa', price: 25, deliveryTime: '24-48h', region: 'Grand Casablanca' },
  { name: 'Rabat', code: 'rabat', price: 30, deliveryTime: '24-48h', region: 'Rabat-Salé-Kénitra' },
  { name: 'Marrakech', code: 'marrakech', price: 35, deliveryTime: '48-72h', region: 'Marrakech-Safi' },
  { name: 'Fès', code: 'fes', price: 35, deliveryTime: '48-72h', region: 'Fès-Meknès' },
  { name: 'Tanger', code: 'tanger', price: 40, deliveryTime: '48-72h', region: 'Tanger-Tétouan-Al Hoceïma' },
  { name: 'Agadir', code: 'agadir', price: 45, deliveryTime: '72h-5j', region: 'Souss-Massa' },
  
  // Villes moyennes
  { name: 'Salé', code: 'sale', price: 30, deliveryTime: '24-48h', region: 'Rabat-Salé-Kénitra' },
  { name: 'Meknès', code: 'meknes', price: 35, deliveryTime: '48-72h', region: 'Fès-Meknès' },
  { name: 'Oujda', code: 'oujda', price: 50, deliveryTime: '72h-5j', region: 'Oriental' },
  { name: 'Kénitra', code: 'kenitra', price: 35, deliveryTime: '48-72h', region: 'Rabat-Salé-Kénitra' },
  { name: 'Tétouan', code: 'tetouan', price: 45, deliveryTime: '72h-5j', region: 'Tanger-Tétouan-Al Hoceïma' },
  { name: 'Safi', code: 'safi', price: 40, deliveryTime: '72h-5j', region: 'Marrakech-Safi' },
  { name: 'El Jadida', code: 'jadida', price: 35, deliveryTime: '48-72h', region: 'Casablanca-Settat' },
  { name: 'Beni Mellal', code: 'benimellal', price: 40, deliveryTime: '72h-5j', region: 'Béni Mellal-Khénifra' },
  { name: 'Nador', code: 'nador', price: 50, deliveryTime: '72h-5j', region: 'Oriental' },
  { name: 'Khouribga', code: 'khouribga', price: 35, deliveryTime: '48-72h', region: 'Casablanca-Settat' },
  
  // Autres villes
  { name: 'Mohammedia', code: 'mohammedia', price: 25, deliveryTime: '24-48h', region: 'Grand Casablanca' },
  { name: 'Settat', code: 'settat', price: 35, deliveryTime: '48-72h', region: 'Casablanca-Settat' },
  { name: 'Berrechid', code: 'berrechid', price: 30, deliveryTime: '48-72h', region: 'Casablanca-Settat' },
  { name: 'Khemisset', code: 'khemisset', price: 35, deliveryTime: '48-72h', region: 'Rabat-Salé-Kénitra' },
  { name: 'Larache', code: 'larache', price: 45, deliveryTime: '72h-5j', region: 'Tanger-Tétouan-Al Hoceïma' },
];

export const DEFAULT_SHIPPING_PRICE = 55; // Pour les villes non listées
export const DEFAULT_DELIVERY_TIME = '5-7 jours';

/**
 * Trouve les informations de livraison pour une ville
 */
export function getShippingInfo(cityCode: string): ShippingCity | null {
  return SHIPPING_CITIES.find(city => city.code === cityCode) || null;
}

/**
 * Calcule les frais de livraison
 */
export function calculateShippingCost(cityCode: string): number {
  const cityInfo = getShippingInfo(cityCode);
  return cityInfo ? cityInfo.price : DEFAULT_SHIPPING_PRICE;
}

/**
 * Obtient le délai de livraison
 */
export function getDeliveryTime(cityCode: string): string {
  const cityInfo = getShippingInfo(cityCode);
  return cityInfo ? cityInfo.deliveryTime : DEFAULT_DELIVERY_TIME;
}

/**
 * Groupe les villes par région pour l'affichage
 */
export function getCitiesByRegion(): Record<string, ShippingCity[]> {
  return SHIPPING_CITIES.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, ShippingCity[]>);
}

/**
 * Vérifie si la livraison est disponible pour une ville
 */
export function isDeliveryAvailable(cityCode: string): boolean {
  return getShippingInfo(cityCode) !== null || cityCode === 'other';
}

/**
 * Formate les informations de livraison pour l'affichage
 */
export function formatShippingInfo(cityCode: string): string {
  const cityInfo = getShippingInfo(cityCode);
  if (cityInfo) {
    return `${cityInfo.price} DH - Livraison ${cityInfo.deliveryTime}`;
  }
  return `${DEFAULT_SHIPPING_PRICE} DH - Livraison ${DEFAULT_DELIVERY_TIME}`;
}