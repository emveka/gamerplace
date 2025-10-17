// stores/pcBuilderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PCBuild, PCBuildComponents, PCComponent, ComponentType, CompatibilityIssue } from '@/types/pcbuilder';

interface PCBuilderStore {
  currentBuild: PCBuild;
  savedBuilds: PCBuild[];
  isLoading: boolean;
  
  // Actions pour les composants
  addComponent: (componentType: ComponentType, component: PCComponent) => void;
  removeComponent: (componentType: ComponentType, componentId?: string) => void;
  clearBuild: () => void;
  
  // Actions pour les builds
  saveBuild: (name: string) => void;
  loadBuild: (buildId: string) => void;
  deleteBuild: (buildId: string) => void;
  updateBuildName: (name: string) => void;
  
  // Utilitaires
  getTotalPrice: () => number;
  getCompatibilityIssues: () => CompatibilityIssue[];
  canAddComponent: (componentType: ComponentType) => boolean;
  getComponentCount: (componentType: ComponentType) => number;
}

// Fonction de validation de compatibilité (simplifiée pour le moment)
function checkCompatibility(components: PCBuildComponents): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // Pour le moment, vérifications basiques seulement
  
  // Vérifier CPU + Motherboard socket (uniquement si pas "Universal")
  if (components.cpu && components.motherboard) {
    if (components.cpu.socket && components.motherboard.socket) {
      if (components.cpu.socket !== 'Universal' && 
          components.motherboard.socket !== 'Universal' &&
          components.cpu.socket !== components.motherboard.socket) {
        issues.push({
          type: 'warning', // Warning au lieu d'erreur pour le moment
          message: `Vérifiez la compatibilité socket: ${components.cpu.socket} (CPU) vs ${components.motherboard.socket} (Carte Mère)`,
          components: ['cpu', 'motherboard']
        });
      }
    }
  }
  
  // Vérifier RAM + Motherboard type (uniquement si pas DDR4 par défaut)
  if (components.ram && components.ram.length > 0 && components.motherboard) {
    const ramType = components.ram[0].ramType;
    if (ramType && components.motherboard.ramType) {
      if (ramType !== components.motherboard.ramType && ramType !== 'DDR4') {
        issues.push({
          type: 'warning',
          message: `Vérifiez la compatibilité RAM: ${ramType} vs ${components.motherboard.ramType}`,
          components: ['ram', 'motherboard']
        });
      }
    }
  }
  
  // Vérifications de base (sans erreur bloquante)
  if (components.motherboard && components.case) {
    if (components.motherboard.formFactor && components.case.formFactor) {
      if (components.motherboard.formFactor !== 'ATX' && 
          components.case.formFactor !== 'ATX' &&
          components.motherboard.formFactor !== components.case.formFactor) {
        issues.push({
          type: 'warning',
          message: `Vérifiez la compatibilité format: Carte Mère ${components.motherboard.formFactor} vs Boîtier ${components.case.formFactor}`,
          components: ['motherboard', 'case']
        });
      }
    }
  }
  
  return issues;
}

export const usePCBuilderStore = create<PCBuilderStore>()(
  persist(
    (set, get) => ({
      currentBuild: {
        name: 'Nouvelle Configuration',
        components: {},
        totalPrice: 0,
        isValid: true,
      },
      savedBuilds: [],
      isLoading: false,

      addComponent: (componentType, component) => {
        const { currentBuild } = get();
        const newComponents = { ...currentBuild.components };
        
        if (componentType === 'ram' || componentType === 'storage') {
          // Composants multiples
          if (!newComponents[componentType]) {
            newComponents[componentType] = [];
          }
          (newComponents[componentType] as PCComponent[]).push(component);
        } else {
          // Composant unique
          newComponents[componentType] = component;
        }
        
        const issues = checkCompatibility(newComponents);
        const totalPrice = calculateTotalPrice(newComponents);
        
        set({
          currentBuild: {
            ...currentBuild,
            components: newComponents,
            totalPrice,
            isValid: issues.filter(issue => issue.type === 'error').length === 0,
          }
        });
      },

      removeComponent: (componentType, componentId) => {
        const { currentBuild } = get();
        const newComponents = { ...currentBuild.components };
        
        if (componentType === 'ram' || componentType === 'storage') {
          // Retirer un élément spécifique du tableau
          if (componentId && newComponents[componentType]) {
            newComponents[componentType] = (newComponents[componentType] as PCComponent[])
              .filter(comp => comp.id !== componentId);
              
            if ((newComponents[componentType] as PCComponent[]).length === 0) {
              delete newComponents[componentType];
            }
          }
        } else {
          // Supprimer le composant unique
          delete newComponents[componentType];
        }
        
        const issues = checkCompatibility(newComponents);
        const totalPrice = calculateTotalPrice(newComponents);
        
        set({
          currentBuild: {
            ...currentBuild,
            components: newComponents,
            totalPrice,
            isValid: issues.filter(issue => issue.type === 'error').length === 0,
          }
        });
      },

      clearBuild: () => {
        set({
          currentBuild: {
            name: 'Nouvelle Configuration',
            components: {},
            totalPrice: 0,
            isValid: true,
          }
        });
      },

      saveBuild: (name) => {
        const { currentBuild, savedBuilds } = get();
        const newBuild: PCBuild = {
          ...currentBuild,
          id: Date.now().toString(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({
          savedBuilds: [...savedBuilds, newBuild]
        });
      },

      loadBuild: (buildId) => {
        const { savedBuilds } = get();
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (build) {
          set({
            currentBuild: {
              ...build,
              name: `${build.name} (Copie)`,
              id: undefined,
            }
          });
        }
      },

      deleteBuild: (buildId) => {
        const { savedBuilds } = get();
        set({
          savedBuilds: savedBuilds.filter(b => b.id !== buildId)
        });
      },

      updateBuildName: (name) => {
        const { currentBuild } = get();
        set({
          currentBuild: {
            ...currentBuild,
            name
          }
        });
      },

      getTotalPrice: () => {
        return get().currentBuild.totalPrice;
      },

      getCompatibilityIssues: () => {
        const { currentBuild } = get();
        return checkCompatibility(currentBuild.components);
      },

      canAddComponent: (componentType) => {
        const { currentBuild } = get();
        const components = currentBuild.components;
        
        if (componentType === 'ram') {
          const currentRam = components.ram?.length || 0;
          return currentRam < 4; // Max 4 barrettes
        }
        
        if (componentType === 'storage') {
          const currentStorage = components.storage?.length || 0;
          return currentStorage < 4; // Max 4 stockages
        }
        
        // Composants uniques - vérifier s'il n'y en a pas déjà un
        return !components[componentType];
      },

      getComponentCount: (componentType) => {
        const { currentBuild } = get();
        const component = currentBuild.components[componentType];
        
        if (Array.isArray(component)) {
          return component.length;
        }
        
        return component ? 1 : 0;
      },
    }),
    {
      name: 'pc-builder-storage',
      partialize: (state) => ({
        currentBuild: state.currentBuild,
        savedBuilds: state.savedBuilds,
      }),
    }
  )
);

// Fonction utilitaire pour calculer le prix total
function calculateTotalPrice(components: PCBuildComponents): number {
  let total = 0;
  
  Object.values(components).forEach(component => {
    if (Array.isArray(component)) {
      component.forEach(comp => total += comp.price);
    } else if (component) {
      total += component.price;
    }
  });
  
  return total;
}