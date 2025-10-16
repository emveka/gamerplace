// app/pc-builder/page.tsx

import { Metadata } from 'next';
import { PCBuilderInterface } from '@/components/pcbuilder/PCBuilderInterface';
import { PCComponent, ComponentType } from '@/types/pcbuilder';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const metadata: Metadata = {
  title: 'PC Builder - Assemblez votre PC Gaming | Gamerplace.ma',
  description: 'Créez votre PC Gaming personnalisé avec notre configurateur. Vérification de compatibilité automatique et prix en temps réel.',
  keywords: 'PC Builder Maroc, configurateur PC gaming, assembler PC gaming, compatibilité composants PC',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://gamerplace.ma/pc-builder',
  },
  openGraph: {
    type: 'website',
    title: 'PC Builder - Configurateur PC Gaming | Gamerplace.ma',
    description: 'Assemblez votre PC Gaming avec notre configurateur intelligent. Vérification de compatibilité et prix en temps réel.',
    url: 'https://gamerplace.ma/pc-builder',
    siteName: 'Gamerplace.ma',
    locale: 'fr_MA',
  },
};

// Interface pour typer les données Firebase - CORRIGÉE
interface FirebaseProductData {
  title?: string;
  price?: number;
  images?: string[];
  slug?: string;
  stock?: number;
  brandName?: string;
  primaryCategoryId?: string;
  categoryIds?: string[];  // ✅ CORRIGÉ: Type explicite pour l'itération
  categoryPath?: string[]; // ✅ AJOUTÉ: Manquait dans l'interface
  technicalInfo?: Record<string, Record<string, unknown>>;
  isActive?: boolean;
  [key: string]: unknown;
}

// Fonction pour récupérer les composants PC depuis Firebase
async function getPCComponents(): Promise<{[key in ComponentType]: PCComponent[]}> {
  try {
    const productsRef = collection(db, 'products');
    const productsQuery = query(
      productsRef,
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(productsQuery);
    
    // Initialiser avec des tableaux vides
    const componentsData: {[key in ComponentType]: PCComponent[]} = {
      cpu: [],
      motherboard: [],
      ram: [],
      gpu: [],
      storage: [],
      psu: [],
      case: [],
      cooling: [],
    };
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as FirebaseProductData;
      
      // Debug pour voir les categoryIds (toute la hiérarchie)
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Produit "${data.title}":`, {
          primaryCategoryId: data.primaryCategoryId,
          categoryIds: data.categoryIds,
          categoryPath: data.categoryPath
        });
      }
      
      // Chercher dans TOUS les categoryIds (hiérarchie complète)
      let componentType: ComponentType | null = null;
      
      // D'abord essayer avec primaryCategoryId
      componentType = mapCategoryToComponentType(data.primaryCategoryId || '');
      
      // Si pas trouvé, chercher dans tous les categoryIds
      if (!componentType && data.categoryIds && Array.isArray(data.categoryIds)) {
        for (const categoryId of data.categoryIds) {
          componentType = mapCategoryToComponentType(categoryId);
          if (componentType) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`🎯 Trouvé dans categoryIds[]: ${categoryId} -> ${componentType}`);
            }
            break;
          }
        }
      }
      
      if (componentType && componentsData[componentType]) {
        const component: PCComponent = {
          id: doc.id,
          productId: doc.id,
          componentType,
          title: data.title || '',
          price: data.price || 0,
          imageUrl: data.images?.[0],
          slug: data.slug || '',
          stock: data.stock || 0,
          brandName: data.brandName || '',
          
          // Extraire les spécifications avec typage correct
          socket: extractSocketSpec(data.technicalInfo),
          ramType: extractRamTypeSpec(data.technicalInfo),
          formFactor: extractFormFactorSpec(data.technicalInfo),
          maxRamCapacity: extractNumberSpec(data.technicalInfo, 'maxRamCapacity'),
          ramSlots: extractNumberSpec(data.technicalInfo, 'ramSlots'),
        };
        
        componentsData[componentType].push(component);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Ajouté comme ${componentType}:`, component.title);
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Aucune catégorie mappée pour "${data.title}"`);
        console.log(`   primaryCategoryId: "${data.primaryCategoryId}"`);
        console.log(`   categoryIds:`, data.categoryIds);
      }
    });
    
    return componentsData;
  } catch (error) {
    console.error('Erreur lors de la récupération des composants:', error);
    
    // Retourner des données vides en cas d'erreur
    return {
      cpu: [],
      motherboard: [],
      ram: [],
      gpu: [],
      storage: [],
      psu: [],
      case: [],
      cooling: [],
    };
  }
}

// Fonction pour mapper les IDs de catégories vers les types de composants
function mapCategoryToComponentType(categoryId: string): ComponentType | null {
  const categoryMapping: {[key: string]: ComponentType} = {
    // 🔥 PROCESSEURS - Ajoutez TOUS vos IDs de catégories processeurs ici
    'MRisGslLF4oodGbHZU7A': 'cpu',        // Processeurs (principal)
    'mUp734AQ6hPjUBuXxVKd': 'cpu',               // Sous-catégorie AMD Ryzen
    'HjQF7XyYxBrDXbKTZTwu': 'cpu',              // Sous-catégorie Intel Core
    // 'ID_RYZEN_3': 'cpu',                 // Ryzen 3
    // 'ID_RYZEN_5': 'cpu',                 // Ryzen 5
    // 'ID_RYZEN_7': 'cpu',                 // Ryzen 7
    // 'ID_CORE_I3': 'cpu',                 // Core i3
    // 'ID_CORE_I5': 'cpu',                 // Core i5
    // 'ID_CORE_I7': 'cpu',                 // Core i7
    
    // 🎮 CARTES GRAPHIQUES - Ajoutez TOUS vos IDs ici
    'LazrSiL0nF7yh8eVnvS5': 'gpu',        // Cartes graphiques (principal)
    '5Vr1TpflIGe4XDQ1eIRn': 'gpu',                  // NVIDIA
    // 'ID_AMD_GPU': 'gpu',                 // AMD GPU
    // 'ID_RTX_4060': 'gpu',                // RTX 4060
    // 'ID_RTX_4070': 'gpu',                // RTX 4070
    // 'ID_RTX_4080': 'gpu',                // RTX 4080
    // 'ID_RX_7600': 'gpu',                 // RX 7600
    // 'ID_RX_7700': 'gpu',                 // RX 7700
    
    // 🔧 CARTES MÈRES - Ajoutez vos IDs ici
     'Os0zYZMftFb8Wqts8tGZ': 'motherboard',
    // 'ID_AMD_MOTHERBOARD': 'motherboard',
    // 'ID_INTEL_MOTHERBOARD': 'motherboard',
    // 'ID_B450': 'motherboard',
    // 'ID_B550': 'motherboard',
    // 'ID_X570': 'motherboard',
    
    // 💾 MÉMOIRE RAM - Ajoutez vos IDs ici  
     'MXjluFjyuPxgBHYjs5pG': 'ram',
     'yFa1HWdjFAKIKj7EyhTB': 'ram',
    '4t43LeLkkEnMlj3RtQea': 'ram',
    'uXKYHjPNSwZhnzoyqJ25': 'ram',
    
    // 💿 STOCKAGE - Ajoutez vos IDs ici
    'sFrZYvcFhsYlUGdlHaFw': 'storage',
    // 'ID_SSD': 'storage',
    // 'ID_HDD': 'storage',
    // 'ID_NVME': 'storage',
    // 'ID_SATA': 'storage',
    
    // 🔌 ALIMENTATIONS - Ajoutez vos IDs ici
     '8ppL7xZgaPU07FAlZyBK ': 'psu',
    // 'ID_500W': 'psu',
    // 'ID_650W': 'psu',
    // 'ID_750W': 'psu',
    // 'ID_MODULAIRE': 'psu',
    
    // 📦 BOÎTIERS - Ajoutez vos IDs ici
    't0SePGqxSmOfmYZ2ea1X': 'case',        // PC Gamer -> temporairement boîtiers
     'euwVi0JBDfHiIWM5HDFe ': 'case',
    // 'ID_ATX_CASE': 'case',
    // 'ID_MATX_CASE': 'case',
    // 'ID_ITX_CASE': 'case',
    
    // ❄️ REFROIDISSEMENT - Ajoutez vos IDs ici
    'DvdQql10V4LbVnIpwFwv ': 'cooling',
    // 'ID_AIR_COOLING': 'cooling',
    // 'ID_LIQUID_COOLING': 'cooling',
    // 'ID_VENTILATEUR': 'cooling',
  };
  
  return categoryMapping[categoryId] || null;
}

// Fonctions spécialisées pour extraire les specs avec typage correct
function extractSocketSpec(technicalInfo: Record<string, Record<string, unknown>> | undefined): string | undefined {
  const value = extractTechnicalSpec(technicalInfo, 'socket');
  return typeof value === 'string' ? value : undefined;
}

function extractRamTypeSpec(technicalInfo: Record<string, Record<string, unknown>> | undefined): 'DDR4' | 'DDR5' | undefined {
  const value = extractTechnicalSpec(technicalInfo, 'ramType');
  if (typeof value === 'string' && (value === 'DDR4' || value === 'DDR5')) {
    return value;
  }
  return 'DDR4'; // Fallback par défaut
}

function extractFormFactorSpec(technicalInfo: Record<string, Record<string, unknown>> | undefined): string | undefined {
  const value = extractTechnicalSpec(technicalInfo, 'formFactor');
  return typeof value === 'string' ? value : undefined;
}

function extractNumberSpec(technicalInfo: Record<string, Record<string, unknown>> | undefined, specKey: string): number | undefined {
  const value = extractTechnicalSpec(technicalInfo, specKey);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

// Fonction générique pour extraire les specs techniques
function extractTechnicalSpec(
  technicalInfo: Record<string, Record<string, unknown>> | undefined, 
  specKey: string
): string | number | undefined {
  if (!technicalInfo || typeof technicalInfo !== 'object') {
    return undefined;
  }
  
  // Chercher dans toutes les sections techniques
  for (const sectionKey in technicalInfo) {
    const section = technicalInfo[sectionKey];
    if (section && typeof section === 'object' && specKey in section) {
      const value = section[specKey];
      return typeof value === 'string' || typeof value === 'number' ? value : undefined;
    }
  }
  
  return undefined;
}

export default async function PCBuilderPage() {
  // Toujours utiliser vos vrais produits Firebase
  const componentsData = await getPCComponents();
  
  // Debug pour voir combien de produits sont récupérés
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Produits récupérés par catégorie:', {
      cpu: componentsData.cpu.length,
      gpu: componentsData.gpu.length,
      case: componentsData.case.length,
      // Autres catégories seront à 0 pour le moment
    });
  }
  
  return (
    <div className="min-h-screen bg-white">
      <PCBuilderInterface componentsData={componentsData} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate toutes les heures