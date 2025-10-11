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
 * Type de template supporté - TOUS LES TEMPLATES
 */
type TemplateType = 
  | 'pc_gamer' 
  | 'processeur' 
  | 'carte_graphique' 
  | 'carte_mere'
  | 'moniteur'
  | 'ram'
  | 'alimentation'
  | 'default';

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

    // Templates Carte Mère
    const carteMereCategories = ['carte mère', 'cartes mères', 'motherboard'];
    if (carteMereCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'carte_mere';
    }

    // Templates Moniteur
    const moniteurCategories = ['moniteur', 'moniteurs', 'écran', 'écrans', 'display'];
    if (moniteurCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'moniteur';
    }

    // Templates RAM
    const ramCategories = ['ram', 'mémoire', 'mémoire ram', 'barrette mémoire'];
    if (ramCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'ram';
    }

    // Templates Alimentation
    const alimentationCategories = ['alimentation', 'alimentations', 'psu', 'power supply'];
    if (alimentationCategories.some(cat => categoryLower.includes(cat.toLowerCase()))) {
      return 'alimentation';
    }
    
    return 'default';
  };

  /**
   * 🏷️ Mappings des champs par template
   * Chaque template a son propre mapping de champs avec labels en français
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
      'marque_processeur': 'Marque Processeur',
      'type_processeur': 'Type de processeur', 
      'processeur': 'Processeur',
      'frequence_cpu': 'Fréquence CPU',
      'coeurs_threads': 'Cœurs / Threads',
      
      // Mémoire
      'modele_memoire': 'Modèle Mémoire',
      'rgb': 'RGB',
      'capacite_ram': 'Capacité RAM totale',
      'nombre_barrettes': 'Configuration barrettes',
      'frequence_ram': 'Fréquence RAM',
      
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
      'marque_alimentation': 'Marque Alimentation',
      'modele_alimentation': 'Modèle Alimentation',
      'puissance': 'Puissance',
      'certification': 'Certification',
      'modulaire': 'Modulaire',
      
      // Refroidissement
      'type_refroidissement': 'Type de refroidissement',
      'marque_refroidissement': 'Marque Refroidissement',
      'modele_refroidissement': 'Modèle Refroidissement',
      
      // Équipement
      'clavier_fournis': 'Clavier fournis',
      'souris_fournis': 'Souris fournis',
      'tapis_souris_fournis': 'Tapis de souris fournis',
      'casque_fournis': 'Casque fournis',
      'webcam_fournis': 'Webcam fournis',
      
      // Garanties
      'garantie': 'Garantie',
    },

    // 🔧 TEMPLATE PROCESSEUR
    processeur: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle',
      'serie': 'Série',
      'socket': 'Socket',
      'usage_recommande': 'Usage recommandé',
      
      // Performance
      'nb_coeurs': 'Nombre de cœurs',
      'nb_threads': 'Nombre de threads',
      'freq_base': 'Fréquence de base',
      'freq_boost': 'Fréquence boost/turbo',
      'cache_l3': 'Cache L3',
      
      // Spécifications techniques
      'architecture': 'Architecture',
      'lithographie': 'Finesse de gravure',
      'tdp': 'TDP',
      
      // Compatibilité
      'type_memoire': 'Type mémoire supportée',
      'freq_memoire_max': 'Fréquence mémoire maximale',
      
      // Fonctionnalités
      'overclocking': 'Overclocking supporté',
      'gpu_integre': 'GPU intégré',
      'modele_gpu_integre': 'Modèle GPU intégré',
      'refroidisseur_inclus': 'Refroidisseur inclus',
    },

    // 🎨 TEMPLATE CARTE GRAPHIQUE
    carte_graphique: {
      // Informations produit
      'nom_commercial': 'Nom commercial',
      'marque_constructeur': 'Marque constructeur',
      'marque_partenaire': 'Marque partenaire',
      'modele_gpu': 'Modèle GPU',
      'modele_specifique': 'Modèle spécifique',
      
      // Performance
      'nb_coeurs_cuda': 'Cœurs de calcul',
      'freq_base': 'Fréquence de base',
      'freq_boost': 'Fréquence boost/turbo',
      'performance_ia': 'Performance IA',
      
      // Mémoire
      'capacite_vram': 'Taille mémoire',
      'type_memoire': 'Type de mémoire',
      'vitesse_memoire': 'Vitesse mémoire',
      'interface_memoire': 'Interface mémoire',
      
      // Affichage
      'resolution_max': 'Résolution maximale',
      'nb_ecrans_supportes': 'Nombre d\'écrans supportés',
      'sorties_video': 'Connecteurs vidéo',
      
      // Alimentation et Taille
      'consommation_tdp': 'Consommation (TDP)',
      'alimentation_recommandee': 'Alimentation recommandée',
      'connecteur_alimentation': 'Connecteur d\'alimentation',
      'longueur': 'Longueur',
      'largeur': 'Largeur',
      'epaisseur': 'Épaisseur',
      
      // Fonctionnalités
      'ray_tracing': 'Ray Tracing',
      'dlss_fsr': 'Technologie d\'upscaling',
      'bus_pci': 'Interface',
      'opengl': 'OpenGL',
      'support_vr': 'Support VR',
      
      // Informations complémentaires
      'garantie': 'Garantie',
      'rgb_eclairage': 'Éclairage RGB',
      'overclocking_usine': 'Pré-overclockée',
      'refroidissement_info': 'Système de refroidissement',
    },

    // 🔌 TEMPLATE CARTE MÈRE
    carte_mere: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle',
      'format': 'Format',
      'usage_recommande': 'Usage recommandé',
      
      // Compatibilité processeur
      'socket': 'Socket',
      'chipset': 'Chipset',
      
      // Mémoire
      'type_memoire': 'Type de mémoire',
      'nb_slots_memoire': 'Nombre de slots mémoire',
      'capacite_max': 'Capacité maximale',
      'freq_memoire_max': 'Fréquence maximale',
      'dual_channel': 'Support Dual Channel',
      
      // Connectique Stockage
      'nb_sata3': 'Ports SATA 3.0',
      'nb_m2_slots': 'Slots M.2',
      'type_m2': 'Types M.2 supportés',
      'pcie_m2': 'Interface M.2',
      'raid_support': 'Support RAID',
      
      // Slots d'extension
      'nb_pcie_x16': 'Slots PCIe x16',
      'nb_pcie_x8': 'Slots PCIe x8',
      'nb_pcie_x4': 'Slots PCIe x4',
      'nb_pcie_x1': 'Slots PCIe x1',
      'version_pcie': 'Version PCIe',
      
      // Connectique I/O
      'nb_usb_2': 'Ports USB 2.0',
      'nb_usb_3': 'Ports USB 3.0/3.1',
      'nb_usb_3_2': 'Ports USB 3.2',
      'usb_type_c': 'Port USB Type-C',
      'nb_ethernet': 'Ports Ethernet',
      'audio_codec': 'Codec Audio',
      'sorties_video': 'Sorties vidéo intégrées',
      
      // Fonctionnalités
      'wifi': 'WiFi intégré',
      'version_wifi': 'Version WiFi',
      'bluetooth': 'Bluetooth',
      'version_bluetooth': 'Version Bluetooth',
      'rgb_lighting': 'Éclairage RGB',
      'logiciel_rgb': 'Logiciel RGB',
      'overclocking': 'Support overclocking',
    },

    // 🖥️ TEMPLATE MONITEUR
    moniteur: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle',
      'taille_ecran': 'Taille d\'écran',
      'usage_recommande': 'Usage recommandé',
      
      // Affichage
      'resolution': 'Résolution',
      'format_ecran': 'Format d\'écran',
      'type_dalle': 'Type de dalle',
      'taux_rafraichissement': 'Taux de rafraîchissement',
      'temps_reponse': 'Temps de réponse',
      
      // Connectique
      'nb_hdmi': 'Ports HDMI',
      'version_hdmi': 'Version HDMI',
      'nb_displayport': 'Ports DisplayPort',
      'version_displayport': 'Version DisplayPort',
      'usb_c': 'Port USB-C',
      'nb_usb': 'Ports USB (hub)',
      'dvi': 'Port DVI',
      'vga': 'Port VGA',
      
      // Garanties
      'garantie': 'Garantie',
    },

    // 🧠 TEMPLATE RAM
    ram: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle/Série',
      
      // Capacité et Type
      'capacite_totale': 'Capacité totale',
      'configuration': 'Configuration',
      'type_memoire': 'Type de mémoire',
      'format': 'Format',
      
      // Performances
      'frequence': 'Fréquence',
      'latence_cas': 'Latence CAS (CL)',
      'voltage': 'Voltage',
      
      // Design et Fonctionnalités
      'eclairage_rgb': 'Éclairage RGB',
      'radiateur': 'Radiateur/Dissipateur',
      'couleur': 'Couleur principale',
      
      // Garantie et Infos
      'garantie': 'Durée de garantie',
    },

    // ⚡ TEMPLATE ALIMENTATION
    alimentation: {
      // Informations générales
      'designation': 'Désignation',
      'marque': 'Marque',
      'modele': 'Modèle/Série',
      
      // Puissance et Certification
      'puissance': 'Puissance',
      'certification_80plus': 'Certification 80 PLUS',
      'efficacite': 'Efficacité',
      
      // Format et Modularité
      'format': 'Format',
      'modularite': 'Modularité',
      'longueur_cables': 'Longueur des câbles',
      
      // Fonctionnalités
      'eclairage_rgb': 'Éclairage RGB',
      'protections': 'Protections intégrées',
      
      // Garantie et Usage
      'garantie': 'Durée de garantie',
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
   * Définit le titre et l'ordre d'affichage de chaque section pour chaque template
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

    // 🔧 SECTIONS PROCESSEUR
    processeur: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'performance': { title: 'PERFORMANCE', order: 2 },
      'specifications_techniques': { title: 'SPÉCIFICATIONS TECHNIQUES', order: 3 },
      'compatibilite': { title: 'COMPATIBILITÉ', order: 4 },
      'fonctionnalites': { title: 'FONCTIONNALITÉS', order: 5 },
    },

    // 🎨 SECTIONS CARTE GRAPHIQUE
    carte_graphique: {
      'informations_produit': { title: 'INFORMATIONS PRODUIT', order: 1 },
      'performance': { title: 'PERFORMANCE', order: 2 },
      'memoire': { title: 'MÉMOIRE', order: 3 },
      'affichage': { title: 'AFFICHAGE', order: 4 },
      'alimentation_taille': { title: 'ALIMENTATION ET TAILLE', order: 5 },
      'fonctionnalites': { title: 'FONCTIONNALITÉS', order: 6 },
      'informations_complementaires': { title: 'INFORMATIONS COMPLÉMENTAIRES', order: 7 },
    },

    // 🔌 SECTIONS CARTE MÈRE
    carte_mere: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'compatibilite_processeur': { title: 'COMPATIBILITÉ PROCESSEUR', order: 2 },
      'memoire': { title: 'MÉMOIRE', order: 3 },
      'connectique_stockage': { title: 'CONNECTIQUE STOCKAGE', order: 4 },
      'slots_extension': { title: 'SLOTS D\'EXTENSION', order: 5 },
      'connectique_io': { title: 'CONNECTIQUE I/O', order: 6 },
      'fonctionnalites': { title: 'FONCTIONNALITÉS', order: 7 },
    },

    // 🖥️ SECTIONS MONITEUR
    moniteur: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'affichage': { title: 'AFFICHAGE', order: 2 },
      'connectique': { title: 'CONNECTIQUE', order: 3 },
      'garanties': { title: 'GARANTIES', order: 4 },
    },

    // 🧠 SECTIONS RAM
    ram: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'capacite_type': { title: 'CAPACITÉ ET TYPE', order: 2 },
      'performances': { title: 'PERFORMANCES', order: 3 },
      'design_fonctionnalites': { title: 'DESIGN ET FONCTIONNALITÉS', order: 4 },
      'garantie_infos': { title: 'GARANTIE ET INFORMATIONS', order: 5 },
    },

    // ⚡ SECTIONS ALIMENTATION
    alimentation: {
      'informations_generales': { title: 'INFORMATIONS GÉNÉRALES', order: 1 },
      'puissance_certification': { title: 'PUISSANCE ET CERTIFICATION', order: 2 },
      'format_modularite': { title: 'FORMAT ET MODULARITÉ', order: 3 },
      'fonctionnalites': { title: 'FONCTIONNALITÉS', order: 4 },
      'garantie_usage': { title: 'GARANTIE ET USAGE', order: 5 },
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
   * Gère les booléens, nombres et strings avec formatage spécifique
   */
  const formatValue = (value: string | number | boolean, fieldKey?: string): string => {
    // Gestion des booléens
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    
    // Gestion des nombres
    if (typeof value === 'number') {
      // Formatage spécial pour les fréquences (GHz)
      if (fieldKey?.includes('freq') || fieldKey?.includes('frequence')) {
        return `${value} GHz`;
      }
      // Formatage spécial pour le TDP (Watts)
      if (fieldKey === 'tdp' || fieldKey === 'consommation_tdp') {
        return `${value} W`;
      }
      // Formatage spécial pour les dimensions (mm)
      if (fieldKey === 'longueur' || fieldKey === 'largeur' || fieldKey === 'epaisseur') {
        return `${value} mm`;
      }
      // Formatage spécial pour la vitesse mémoire (Gb/s)
      if (fieldKey === 'vitesse_memoire') {
        return `${value} Gb/s`;
      }
      // Nombres simples (cœurs, threads, ports, etc.)
      return value.toString();
    }
    
    // Gestion des strings (valeur par défaut)
    return value || 'Non spécifié';
  };

  // 🎯 Détection automatique du template basé sur la catégorie du produit
  const templateType = detectTemplateType(product.primaryCategoryName);
  const fieldLabels = templateFieldLabels[templateType];
  const sectionConfig = templateSectionConfig[templateType];

  console.log(`🎯 Template détecté: ${templateType} pour la catégorie: ${product.primaryCategoryName}`);

  /**
   * Fonction pour construire les sections de spécifications
   * Parcourt les données techniques du produit et les organise en sections
   */
  const buildSpecSections = (): SpecSection[] => {
    const sections: SpecSection[] = [];
    
    // Vérifier si le produit a des informations techniques
    if (!product.technicalInfo || typeof product.technicalInfo !== 'object') {
      console.log('❌ Aucune information technique trouvée pour ce produit');
      return [];
    }

    console.log('📊 Informations techniques du produit:', product.technicalInfo);
    console.log(`🔧 Utilisation du template: ${templateType}`);

    // Parcourir chaque section technique du produit
    Object.entries(product.technicalInfo).forEach(([sectionKey, sectionData]) => {
      // Vérifier que sectionData est un objet valide
      if (!sectionData || typeof sectionData !== 'object') {
        console.log(`⚠️ Section ${sectionKey} ignorée: données invalides`);
        return;
      }

      // Obtenir la configuration de la section pour ce template
      const config = sectionConfig[sectionKey];
      if (!config) {
        console.log(`⚠️ Section ${sectionKey} ignorée: non configurée pour le template ${templateType}`);
        return;
      }

      // Construire les items de la section
      const items: SpecItem[] = [];
      
      Object.entries(sectionData).forEach(([fieldKey, fieldValue]) => {
        // Obtenir le libellé français pour ce champ dans ce template
        const label = fieldLabels[fieldKey];
        if (!label) {
          console.log(`⚠️ Champ ${fieldKey} ignoré: libellé non trouvé pour le template ${templateType}`);
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

  /**
   * Fonction pour obtenir la couleur du template (pour l'affichage)
   */
  const getTemplateColor = (template: TemplateType): string => {
    const colors: { [key in TemplateType]: string } = {
      'pc_gamer': 'green',
      'processeur': 'orange',
      'carte_graphique': 'purple',
      'carte_mere': 'blue',
      'moniteur': 'purple',
      'ram': 'indigo',
      'alimentation': 'yellow',
      'default': 'gray'
    };
    return colors[template];
  };

  const templateColor = getTemplateColor(templateType);

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
            Template détecté: <span className="font-medium">{templateType.replace('_', ' ').toUpperCase()}</span>
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
          <span className={`text-xs text-${templateColor}-600 font-medium`}>
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
          <p className={`text-[10px] sm:text-xs text-${templateColor}-600 font-medium`}>
            Affichage optimisé pour {templateType.replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>
  );
}