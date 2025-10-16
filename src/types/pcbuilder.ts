// types/pcbuilder.ts

export type ComponentType = 
  | 'cpu' 
  | 'motherboard' 
  | 'ram' 
  | 'gpu' 
  | 'storage' 
  | 'psu' 
  | 'case' 
  | 'cooling';

export interface PCComponent {
  id: string;
  productId: string; // Référence vers Product existant
  componentType: ComponentType;
  
  // Spécifications pour compatibilité
  socket?: string; // Pour CPU/Motherboard
  ramType?: 'DDR4' | 'DDR5'; // Pour RAM/Motherboard
  formFactor?: string; // ATX, mATX, ITX pour Motherboard/Case
  maxRamCapacity?: number; // Pour Motherboard
  ramSlots?: number; // Pour Motherboard
  
  // Infos du produit (dénormalisées pour performance)
  title: string;
  price: number;
  imageUrl?: string;
  slug: string;
  stock: number;
  brandName: string;
}

export interface PCBuildComponents {
  cpu?: PCComponent;
  motherboard?: PCComponent;
  ram?: PCComponent[];
  gpu?: PCComponent;
  storage?: PCComponent[];
  psu?: PCComponent;
  case?: PCComponent;
  cooling?: PCComponent;
}

export interface PCBuild {
  id?: string;
  name: string;
  components: PCBuildComponents;
  totalPrice: number;
  isValid: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning';
  message: string;
  components: ComponentType[];
}

export interface ComponentCategory {
  type: ComponentType;
  name: string;
  icon: string;
  description: string;
  required: boolean;
  allowMultiple: boolean;
  maxItems?: number;
}

// Configuration des catégories de composants
export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    type: 'cpu',
    name: 'Processeur',
    icon: '/icons/cpuicon.svg',
    description: 'Cerveau de votre PC',
    required: true,
    allowMultiple: false,
  },
  {
    type: 'motherboard',
    name: 'Carte Mère',
    icon: '/icons/motherboardicon.svg',
    description: 'Connecte tous les composants',
    required: true,
    allowMultiple: false,
  },
  {
    type: 'ram',
    name: 'Mémoire RAM',
    icon: '/icons/ramicon.svg',
    description: 'Mémoire vive du système',
    required: true,
    allowMultiple: true,
    maxItems: 4,
  },
  {
    type: 'gpu',
    name: 'Carte Graphique',
    icon: '/icons/gpuicon.svg',
    description: 'Pour les jeux et graphismes',
    required: false,
    allowMultiple: false,
  },
  {
    type: 'storage',
    name: 'Stockage',
    icon: '/icons/storageicon.svg',
    description: 'SSD/HDD pour vos données',
    required: true,
    allowMultiple: true,
    maxItems: 4,
  },
  {
    type: 'psu',
    name: 'Alimentation',
    icon: '/icons/psuicon.svg',
    description: 'Alimente tous les composants',
    required: true,
    allowMultiple: false,
  },
  {
    type: 'case',
    name: 'Boîtier',
    icon: '/icons/caseicon.svg',
    description: 'Protection et refroidissement',
    required: true,
    allowMultiple: false,
  },
  {
    type: 'cooling',
    name: 'Refroidissement',
    icon: '/icons/coolingicon.svg',
    description: 'Refroidissement processeur',
    required: false,
    allowMultiple: false,
  },
];