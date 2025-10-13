// components/product/ProductFicheTechnique.tsx

import React from 'react';
import { SerializedProduct } from '@/utils/serialization';

interface ProductFicheTechniqueProps {
  product: SerializedProduct;
}

// Template pour PC Gamer
const PCGamerTemplate = [
  { key: 'processeur', label: 'Processeur' },
  { key: 'carteGraphique', label: 'Carte Graphique' },
  { key: 'memoire', label: 'Mémoire RAM' },
  { key: 'stockage', label: 'Stockage' },
  { key: 'carteMere', label: 'Carte Mère' },
  { key: 'alimentation', label: 'Alimentation' },
  { key: 'refroidissement', label: 'Refroidissement' },
  { key: 'boitier', label: 'Boîtier' },
  { key: 'systeme', label: 'Système' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Processeur
const ProcesseurTemplate = [
  { key: 'gamme', label: 'Gamme processeur' },
  { key: 'socket', label: 'Socket' },
  { key: 'frequence', label: 'Fréquence CPU' },
  { key: 'frequenceTurbo', label: 'Fréquence en mode Turbo' },
  { key: 'coeurs', label: 'Nombre de coeurs' },
  { key: 'threads', label: 'Nombre de threads' },
  { key: 'graphique', label: 'Contrôleur graphique intégré' },
  { key: 'cacheL1', label: 'Cache L1' },
  { key: 'cacheL2', label: 'Cache L2' },
  { key: 'cacheL3', label: 'Cache L3' },
  { key: 'tdp', label: 'TDP' },
  { key: 'versionBoite', label: 'Version Boîte' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Carte Graphique
const CarteGraphiqueTemplate = [
  { key: 'chipset', label: 'Chipset graphique' },
  { key: 'memoire', label: 'Mémoire vidéo' },
  { key: 'typeMemoire', label: 'Type de mémoire' },
  { key: 'frequenceGPU', label: 'Fréquence GPU' },
  { key: 'frequenceMemoire', label: 'Fréquence mémoire' },
  { key: 'busMemoire', label: 'Bus mémoire' },
  { key: 'connecteurs', label: 'Connecteurs' },
  { key: 'alimentation', label: 'Alimentation' },
  { key: 'longueur', label: 'Longueur' },
  { key: 'refroidissement', label: 'Refroidissement' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Carte Mère
const CarteMereTemplate = [
  { key: 'socket', label: 'Socket processeur' },
  { key: 'chipset', label: 'Chipset' },
  { key: 'formatCarte', label: 'Format de carte' },
  { key: 'slotsRAM', label: 'Slots mémoire' },
  { key: 'memoireMax', label: 'Mémoire maximale' },
  { key: 'typeMemoire', label: 'Type de mémoire' },
  { key: 'slotsPCIe', label: 'Slots PCIe' },
  { key: 'stockage', label: 'Connecteurs stockage' },
  { key: 'usb', label: 'Ports USB' },
  { key: 'reseau', label: 'Réseau' },
  { key: 'audio', label: 'Audio' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Mémoire RAM
const MemoireRAMTemplate = [
  { key: 'capacite', label: 'Capacité' },
  { key: 'typeMemoire', label: 'Type de mémoire' },
  { key: 'frequence', label: 'Fréquence' },
  { key: 'timings', label: 'Timings' },
  { key: 'modules', label: 'Nombre de modules' },
  { key: 'voltage', label: 'Voltage' },
  { key: 'profil', label: 'Profil XMP/DOCP' },
  { key: 'ecc', label: 'Support ECC' },
  { key: 'dissipateur', label: 'Dissipateur' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour SSD/Stockage
const StockageTemplate = [
  { key: 'capacite', label: 'Capacité' },
  { key: 'typeStockage', label: 'Type de stockage' },
  { key: 'interface', label: 'Interface' },
  { key: 'facteurForme', label: 'Facteur de forme' },
  { key: 'vitesseLecture', label: 'Vitesse de lecture' },
  { key: 'vitesseEcriture', label: 'Vitesse d\'écriture' },
  { key: 'memoireCache', label: 'Mémoire cache' },
  { key: 'nand', label: 'Type de NAND' },
  { key: 'controleur', label: 'Contrôleur' },
  { key: 'endurance', label: 'Endurance (TBW)' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Alimentation
const AlimentationTemplate = [
  { key: 'puissance', label: 'Puissance' },
  { key: 'certification', label: 'Certification' },
  { key: 'modulaire', label: 'Modulaire' },
  { key: 'facteurForme', label: 'Facteur de forme' },
  { key: 'rail12V', label: 'Rail +12V' },
  { key: 'connecteurs', label: 'Connecteurs' },
  { key: 'ventilateur', label: 'Ventilateur' },
  { key: 'protections', label: 'Protections' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Refroidisseur
const RefroidisseurTemplate = [
  { key: 'typeRefroidissement', label: 'Type de refroidissement' },
  { key: 'socket', label: 'Compatibilité socket' },
  { key: 'tdpMax', label: 'TDP maximum' },
  { key: 'ventilateurs', label: 'Ventilateurs' },
  { key: 'vitesse', label: 'Vitesse de rotation' },
  { key: 'bruit', label: 'Niveau sonore' },
  { key: 'radiateur', label: 'Radiateur' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'rgb', label: 'RGB' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Souris
const SourisTemplate = [
  { key: 'typeCapteur', label: 'Type de capteur' },
  { key: 'dpi', label: 'DPI' },
  { key: 'boutons', label: 'Nombre de boutons' },
  { key: 'connexion', label: 'Type de connexion' },
  { key: 'autonomie', label: 'Autonomie' },
  { key: 'poids', label: 'Poids' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'rgb', label: 'RGB' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'logiciel', label: 'Logiciel' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Clavier
const ClavierTemplate = [
  { key: 'typeClavier', label: 'Type de clavier' },
  { key: 'switches', label: 'Type de switches' },
  { key: 'layout', label: 'Layout' },
  { key: 'connexion', label: 'Type de connexion' },
  { key: 'autonomie', label: 'Autonomie' },
  { key: 'rgb', label: 'RGB' },
  { key: 'multimedia', label: 'Touches multimédia' },
  { key: 'reposeMains', label: 'Repose-mains' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'logiciel', label: 'Logiciel' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Chaise Gaming
const ChaiseGamingTemplate = [
  { key: 'materiauAssise', label: 'Matériau assise' },
  { key: 'materiauDossier', label: 'Matériau dossier' },
  { key: 'reglages', label: 'Réglages' },
  { key: 'accoudoirs', label: 'Accoudoirs' },
  { key: 'support', label: 'Support lombaire' },
  { key: 'inclinaison', label: 'Inclinaison' },
  { key: 'poidsMax', label: 'Poids maximum' },
  { key: 'roulettes', label: 'Roulettes' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'couleurs', label: 'Couleurs disponibles' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Template pour Bureau Gaming
const BureauGamingTemplate = [
  { key: 'materiauPlateau', label: 'Matériau plateau' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'hauteur', label: 'Hauteur' },
  { key: 'reglable', label: 'Hauteur réglable' },
  { key: 'pieds', label: 'Type de pieds' },
  { key: 'accessoires', label: 'Accessoires inclus' },
  { key: 'gestionCables', label: 'Gestion des câbles' },
  { key: 'rgb', label: 'Éclairage RGB' },
  { key: 'poidsMax', label: 'Poids maximum' },
  { key: 'montage', label: 'Facilité de montage' },
  { key: 'marque', label: 'Marque' },
  { key: 'garantie', label: 'Garantie' },
];

// Mapping des templates par type de produit
const productTemplates = {
  'pc-gamer': PCGamerTemplate,
  'processeur': ProcesseurTemplate,
  'carte-graphique': CarteGraphiqueTemplate,
  'carte-mere': CarteMereTemplate,
  'memoire-ram': MemoireRAMTemplate,
  'ssd-stockage': StockageTemplate,
  'alimentation': AlimentationTemplate,
  'refroidisseur': RefroidisseurTemplate,
  'souris': SourisTemplate,
  'clavier': ClavierTemplate,
  'chaise-gaming': ChaiseGamingTemplate,
  'bureau-gaming': BureauGamingTemplate,
};

// Fonction pour détecter le type de produit
const detectProductType = (product: SerializedProduct): string => {
  const title = product.title.toLowerCase();
  const category = product.primaryCategoryName?.toLowerCase() || '';
  const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
  
  // Recherche par mots-clés dans le titre et la catégorie
  if (title.includes('pc gamer') || title.includes('ordinateur')) return 'pc-gamer';
  if (title.includes('processeur') || title.includes('cpu') || category.includes('processeur')) return 'processeur';
  if (title.includes('carte graphique') || title.includes('gpu') || category.includes('graphique')) return 'carte-graphique';
  if (title.includes('carte mère') || title.includes('motherboard') || category.includes('carte mère')) return 'carte-mere';
  if (title.includes('mémoire') || title.includes('ram') || category.includes('mémoire')) return 'memoire-ram';
  if (title.includes('ssd') || title.includes('disque') || title.includes('stockage') || category.includes('stockage')) return 'ssd-stockage';
  if (title.includes('alimentation') || title.includes('psu') || category.includes('alimentation')) return 'alimentation';
  if (title.includes('refroidisseur') || title.includes('ventirad') || category.includes('refroidissement')) return 'refroidisseur';
  if (title.includes('souris') || title.includes('mouse') || category.includes('souris')) return 'souris';
  if (title.includes('clavier') || title.includes('keyboard') || category.includes('clavier')) return 'clavier';
  if (title.includes('chaise') || title.includes('fauteuil') || category.includes('chaise')) return 'chaise-gaming';
  if (title.includes('bureau') || title.includes('desk') || category.includes('bureau')) return 'bureau-gaming';
  
  // Fallback: utilise le template processeur par défaut
  return 'processeur';
};

export const ProductFicheTechnique: React.FC<ProductFicheTechniqueProps> = ({ product }) => {
  const productType = detectProductType(product);
  const template = productTemplates[productType as keyof typeof productTemplates] || ProcesseurTemplate;
  
  // Récupérer les données techniques du produit
  const technicalInfo = product.technicalInfo || {};
  const specifications = product.specifications || {};
  
  // Combiner les données techniques et les spécifications legacy
  const allSpecs = { ...specifications, ...technicalInfo };
  
  // Filtrer les spécifications qui ont des valeurs
  const availableSpecs = template.filter(spec => {
    const value = allSpecs[spec.key];
    return value && value !== '' && value !== 'Non' && value !== 'N/A';
  });
  
  if (availableSpecs.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Titre séparé comme les autres sections */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 border-l-4 border-yellow-500 pl-3 md:pl-4">
        Fiche technique {product.title}
      </h2>
      
      {/* Tableau des spécifications */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-3 md:p-6">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-100">
                {availableSpecs.map((spec, index) => {
                  const value = allSpecs[spec.key];
                  return (
                    <tr 
                      key={spec.key} 
                      className={`
                        ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                        hover:bg-yellow-50 transition-colors duration-200
                      `}
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-700 w-1/2">
                        <span>{spec.label}</span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 font-semibold">
                        {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};