// components/product/ProductSpecinfo.tsx
'use client';

import { SerializedProduct } from '@/utils/serialization';

/**
 * Interface pour un item de spécification
 */
interface SpecItem {
  label: string;
  value: string;
}

/**
 * Interface pour une section de spécifications
 */
interface SpecSection {
  title: string;
  items: SpecItem[];
}

/**
 * Props du composant ProductSpecinfo
 */
interface ProductSpecinfoProps {
  product: SerializedProduct;
}

/**
 * Type de template supporté
 */
type TemplateType = 'pc_gamer' | 'processeur' | 'carte_graphique' | 'default';

/**
 * Composant ProductSpecinfo avec détection automatique de template
 * 
 * Ce composant détecte automatiquement le type de produit et affiche
 * les spécifications techniques appropriées selon le template correspondant.
 */
export function ProductSpecinfo({ product }: ProductSpecinfoProps) {
  
  /**
   * 🎯 Détection automatique du type de template basé sur la catégorie
   */
  const detectTemplateType = (categoryName?: string): TemplateType => {
    if (!categoryName) return 'default';
    
    const categoryLower = categoryName.toLowerCase();
    
    // Templates PC Gamer
    const pcGamerCategories = ['pc gamer', 'pc gamer amd', 'pc gamer intel', 'ordinateur gaming', 'gaming pc'];
    if (pcGamerCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'pc_gamer';
    }
    
    // Templates Processeur
    const processeurCategories = ['processeurs', 'processeur', 'cpu', 'processeur intel', 'processeur amd'];
    if (processeurCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'processeur';
    }
    
    // Templates Carte Graphique
    const carteGraphiqueCategories = ['carte graphique', 'gpu', 'cartes graphiques'];
    if (carteGraphiqueCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'carte_graphique';
    }
    
    return 'default';
  };

  /**
   * 🏷️ Mappings des champs par template
   */
  const templateFieldLabels: { [key in TemplateType]: { [field: string]: string } } = {
    
    // 🎮 TEMPLATE PC GAMER
    pc_gamer: {
      // Informations générales
      'nomproduit': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle',
      'systeme_exploitation': 'Système d\'exploitation',
      'connexion_wifi': 'Connexion WIFI',
      'format_boitier': 'Format boîtier',
      'usage_recommande': 'Usage recommandé',
      
      // Processeur
      'marque_processeur': 'Marque',
      'type_processeur': 'Type de processeur', 
      'processeur': 'Processeur',
      'frequence_cpu': 'Fréquence CPU',
      'coeurs_threads': 'Cœurs / Threads',
      
      // Mémoire
      'modele_memoire': 'Modèle',
      'rgb': 'RGB',
      'capacite_ram': 'Capacité RAM totale',
      'nombre_barrettes': 'Nombre barrettes',
      'frequence_ram': 'Fréquence',
      
      // Stockage
      'modele_ssd': 'Modèle SSD',
      'disque_principal': 'Disque principal',
      'disque_secondaire': 'Disque secondaire',
      
      // Affichages et carte graphique
      'modele_graphique': 'Modèle graphique',
      'taille_memoire_video': 'Taille mémoire vidéo',
      'sorties_video': 'Sorties vidéo',
      'resolution_optimale': 'Résolution en jeu optimale',
      'nombre_ecrans': 'Nombre d\'écran(s)',
      
      // Alimentation
      'marque_alimentation': 'Marque',
      'modele_alimentation': 'Modèle',
      'puissance': 'Puissance',
      'certification': 'Certification',
      'modulaire': 'Modulaire',
      
      // Refroidissement
      'marque_refroidissement': 'Marque',
      'modele_refroidissement': 'Modèle',
      'type_refroidissement': 'Type',
      
      // Équipement
      'clavier_fournis': 'Clavier fournis',
      'souris_fournis': 'Souris fournis',
      'tapis_souris_fournis': 'Tapis de souris fournis',
      'casque_fournis': 'Casque fournis',
      
      // Garanties
      'garantie': 'Garantie',
    },

    // 🔧 TEMPLATE PROCESSEUR (mis à jour selon tes données Firebase)
    processeur: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle',
      'serie': 'Série',
      'socket': 'Socket',
      'usage_recommande': 'Usage recommandé',
      
      // Performance
      'cache_l3': 'Cache L3',
      'freq_base': 'Fréquence de base',
      'freq_boost': 'Fréquence boost',
      'nb_coeurs': 'Nombre de cœurs',
      'nb_threads': 'Nombre de threads',
      
      // Spécifications techniques
      'architecture': 'Architecture',
      'lithographie': 'Lithographie',
      'tdp': 'TDP',
      
      // Compatibilité
      'freq_memoire_max': 'Fréquence mémoire max',
      'type_memoire': 'Type mémoire supportée',
      
      // Fonctionnalités
      'gpu_integre': 'GPU intégré',
      'modele_gpu_integre': 'Modèle GPU intégré',
      'overclocking': 'Overclocking',
      'refroidisseur_inclus': 'Refroidisseur inclus',
      
      // Garantie
      'garantie': 'Garantie',
    },

    // 🎨 TEMPLATE CARTE GRAPHIQUE
    carte_graphique: {
      // Informations générales
      'marque': 'Marque',
      'modele': 'Modèle',
      'chipset': 'Chipset',
      'architecture': 'Architecture',
      
      // Mémoire
      'taille_memoire': 'Taille mémoire',
      'type_memoire': 'Type mémoire',
      'bus_memoire': 'Bus mémoire',
      'bande_passante': 'Bande passante',
      
      // Performance
      'frequence_base': 'Fréquence de base',
      'frequence_boost': 'Fréquence boost',
      'unites_calcul': 'Unités de calcul',
      'rt_cores': 'RT Cores',
      'tensor_cores': 'Tensor Cores',
      
      // Connectivité
      'sorties_video': 'Sorties vidéo',
      'hdmi': 'HDMI',
      'displayport': 'DisplayPort',
      'usb_c': 'USB-C',
      
      // Alimentation
      'consommation': 'Consommation',
      'connecteurs_alimentation': 'Connecteurs alimentation',
      'alimentation_recommandee': 'Alimentation recommandée',
      
      // Physique
      'longueur': 'Longueur',
      'hauteur': 'Hauteur',
      'slots': 'Slots occupés',
      'refroidissement': 'Refroidissement',
      
      // Garantie
      'garantie': 'Garantie',
    },

    // 📦 TEMPLATE DEFAULT (pour produits non spécialisés)
    default: {
      'marque': 'Marque',
      'modele': 'Modèle',
      'reference': 'Référence',
      'couleur': 'Couleur',
      'dimensions': 'Dimensions',
      'poids': 'Poids',
      'materiau': 'Matériau',
      'garantie': 'Garantie',
    }
  };

  /**
   * 📋 Configuration des sections par template
   */
  const templateSectionConfig: { [key in TemplateType]: { [section: string]: { title: string; order: number } } } = {
    
    // 🎮 SECTIONS PC GAMER
    pc_gamer: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'affichages_carte_graphique': { title: 'AFFICHAGES ET CARTE GRAPHIQUE', order: 2 },
      'processeur': { title: 'PROCESSEUR', order: 3 },
      'memoire': { title: 'MÉMOIRE', order: 4 },
      'stockage': { title: 'STOCKAGE', order: 5 },
      'alimentation': { title: 'ALIMENTATION', order: 6 },
      'refroidissement': { title: 'REFROIDISSEMENT', order: 7 },
      'equipement': { title: 'ÉQUIPEMENT', order: 8 },
      'garanties': { title: 'GARANTIES', order: 9 },
    },

    // 🔧 SECTIONS PROCESSEUR (mises à jour selon tes données Firebase)
    processeur: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'performance': { title: 'PERFORMANCE', order: 2 },
      'specifications_techniques': { title: 'SPÉCIFICATIONS TECHNIQUES', order: 3 },
      'compatibilite': { title: 'COMPATIBILITÉ', order: 4 },
      'fonctionnalites': { title: 'FONCTIONNALITÉS', order: 5 },
      'garanties': { title: 'GARANTIES', order: 6 },
    },

    // 🎨 SECTIONS CARTE GRAPHIQUE
    carte_graphique: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'memoire': { title: 'MÉMOIRE', order: 2 },
      'performance': { title: 'PERFORMANCE', order: 3 },
      'connectivite': { title: 'CONNECTIVITÉ', order: 4 },
      'alimentation': { title: 'ALIMENTATION', order: 5 },
      'physique': { title: 'CARACTÉRISTIQUES PHYSIQUES', order: 6 },
      'garanties': { title: 'GARANTIES', order: 7 },
    },

    // 📦 SECTIONS DEFAULT
    default: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'caracteristiques': { title: 'CARACTÉRISTIQUES', order: 2 },
      'garanties': { title: 'GARANTIES', order: 3 },
    }
  };

  /**
   * Fonction pour formater une valeur selon son type et son contexte
   */
  const formatValue = (value: string | number | boolean, fieldKey?: string): string => {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    if (typeof value === 'number') {
      // Formatage spécial pour les fréquences
      if (fieldKey?.includes('freq') || fieldKey?.includes('frequence')) {
        return `${value} GHz`;
      }
      // Formatage spécial pour le TDP
      if (fieldKey === 'tdp') {
        return `${value} W`;
      }
      // Formatage spécial pour les cœurs et threads
      if (fieldKey?.includes('nb_') || fieldKey?.includes('nombre_')) {
        return value.toString();
      }
      return value.toString();
    }
    return value || 'Non spécifié';
  };

  // 🎯 Détection automatique du template
  const templateType = detectTemplateType(product.primaryCategoryName);
  const fieldLabels = templateFieldLabels[templateType];
  const sectionConfig = templateSectionConfig[templateType];

  console.log(`🎯 Template détecté: ${templateType} pour la catégorie: ${product.primaryCategoryName}`);

  /**
   * Fonction pour construire les sections de spécifications
   */
  const buildSpecSections = (): SpecSection[] => {
    const sections: SpecSection[] = [];
    
    // Vérifier si le produit a des informations techniques
    if (!product.technicalInfo || typeof product.technicalInfo !== 'object') {
      console.log('Aucune information technique trouvée pour ce produit');
      return [];
    }

    console.log('Informations techniques du produit:', product.technicalInfo);
    console.log(`🔧 Utilisation du template: ${templateType}`);

    // Parcourir chaque section technique du produit
    Object.entries(product.technicalInfo).forEach(([sectionKey, sectionData]) => {
      // Vérifier que sectionData est un objet valide
      if (!sectionData || typeof sectionData !== 'object') {
        console.log(`Section ${sectionKey} ignorée: données invalides`);
        return;
      }

      // Obtenir la configuration de la section pour ce template
      const config = sectionConfig[sectionKey];
      if (!config) {
        console.log(`Section ${sectionKey} ignorée: non configurée pour le template ${templateType}`);
        return;
      }

      // Construire les items de la section
      const items: SpecItem[] = [];
      
      Object.entries(sectionData).forEach(([fieldKey, fieldValue]) => {
        // Obtenir le libellé français pour ce champ dans ce template
        const label = fieldLabels[fieldKey];
        if (!label) {
          console.log(`Champ ${fieldKey} ignoré: libellé non trouvé pour le template ${templateType}`);
          return;
        }

        // Formater la valeur et l'ajouter aux items
        const formattedValue = formatValue(fieldValue, fieldKey);
        items.push({
          label,
          value: formattedValue
        });
      });

      // Ajouter la section seulement si elle contient des items
      if (items.length > 0) {
        sections.push({
          title: config.title,
          items: items.sort((a, b) => a.label.localeCompare(b.label))
        });
      }
    });

    // Trier les sections selon leur ordre configuré pour ce template
    return sections.sort((a, b) => {
      const orderA = Object.values(sectionConfig).find(config => config.title === a.title)?.order || 999;
      const orderB = Object.values(sectionConfig).find(config => config.title === b.title)?.order || 999;
      return orderA - orderB;
    });
  };

  // Construire les sections à partir des données du produit
  const specSections = buildSpecSections();

  // Si aucune spécification technique n'est disponible
  if (specSections.length === 0) {
    return (
      <div className="w-full bg-white p-4 sm:p-6 md:p-8">
        <div className="border-l-2 sm:border-l-4 border-yellow-500 pl-3 sm:pl-4 md:pl-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-900">
            Spécifications Techniques
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm sm:text-base">
            Aucune spécification technique disponible pour ce produit.
          </p>
          <p className="text-xs sm:text-sm mt-2">
            Template détecté: <span className="font-medium">{templateType}</span>
          </p>
        </div>
      </div>
    );
  }

  // Diviser les sections en deux colonnes de manière équilibrée
  const leftColumnSections = specSections.slice(0, Math.ceil(specSections.length / 2));
  const rightColumnSections = specSections.slice(Math.ceil(specSections.length / 2));

  return (
    <div className="w-full bg-white p-4 sm:p-6 md:p-8">
      {/* Titre principal avec bordure jaune à gauche - Responsive */}
      <div className="border-l-2 sm:border-l-4 border-yellow-500 pl-3 sm:pl-4 md:pl-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-900">
          Spécifications Techniques
        </h2>
        {/* Sous-titre avec le nom du produit et le template */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
          <p className="text-sm sm:text-base text-gray-600">
            {product.title}
          </p>
          <span className="text-xs text-yellow-600 font-medium">
            Template: {templateType.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Layout responsive : 1 colonne sur mobile, 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        
        {/* Colonne de gauche */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {leftColumnSections.map((section, idx) => (
            <div key={`left-${idx}`}>
              {/* En-tête de section avec ligne horizontale jaune et titre centré */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                <div className="h-px bg-yellow-500 flex-1"></div>
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest text-gray-900 whitespace-nowrap px-1 sm:px-2">
                  {section.title}
                </h3>
                <div className="h-px bg-yellow-500 flex-1"></div>
              </div>
              
              {/* Liste verticale des spécifications */}
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group">
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Colonne de droite */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {rightColumnSections.map((section, idx) => (
            <div key={`right-${idx}`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                <div className="h-px bg-yellow-500 flex-1"></div>
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest text-gray-900 whitespace-nowrap px-1 sm:px-2">
                  {section.title}
                </h3>
                <div className="h-px bg-yellow-500 flex-1"></div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group">
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer avec informations sur le template */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <p className="text-[10px] sm:text-xs text-gray-400">
            Les spécifications peuvent varier selon les configurations disponibles.
          </p>
          <p className="text-[10px] sm:text-xs text-yellow-600">
            Affichage optimisé pour {templateType.replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>
  );
}