// Mise à jour du BuildSummary pour intégrer avec le panier
// components/pcbuilder/BuildSummary.tsx - Partie intégration panier

'use client';

import { useState } from 'react';
import { usePCBuilderStore } from '@/stores/pcBuilderStore';
import { useCartStore } from '@/stores/cartStore';
import { COMPONENT_CATEGORIES } from '@/types/pcbuilder';
import { convertBuildToCartItems } from '@/services/pcBuilderService';

export function BuildSummary() {
  const { 
    currentBuild, 
    getTotalPrice, 
    getCompatibilityIssues,
    clearBuild,
    saveBuild,
    updateBuildName 
  } = usePCBuilderStore();
  
  const { addItem: addToCart } = useCartStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [buildName, setBuildName] = useState(currentBuild.name);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const issues = getCompatibilityIssues();
  const hasErrors = issues.some(issue => issue.type === 'error');
  
  const handleSave = () => {
    const name = prompt('Nom de la configuration:', currentBuild.name);
    if (name?.trim()) {
      saveBuild(name.trim());
      alert('Configuration sauvegardée !');
    }
  };

  const handleNameUpdate = () => {
    if (buildName.trim()) {
      updateBuildName(buildName.trim());
    }
    setIsEditingName(false);
  };

  const handleAddToCart = async () => {
    if (hasErrors || getTotalPrice() === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      const cartItems = convertBuildToCartItems(currentBuild.components);
      
      // Ajouter chaque composant au panier
      cartItems.forEach(item => {
        addToCart(item);
      });
      
      alert(`${cartItems.length} composants ajoutés au panier !`);
      
      // Optionnel : vider la config après ajout au panier
      const shouldClear = confirm('Configuration ajoutée au panier ! Voulez-vous commencer une nouvelle configuration ?');
      if (shouldClear) {
        clearBuild();
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const componentCount = Object.values(currentBuild.components).reduce((count, component) => {
    if (Array.isArray(component)) {
      return count + component.length;
    }
    return component ? count + 1 : count;
  }, 0);

  return (
    <div className="bg-white shadow-sm p-6 sticky top-4 border-0">
      <div className="mb-4">
        {isEditingName ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              className="flex-1 px-3 py-1 border-0 text-sm bg-gray-100"
              onBlur={handleNameUpdate}
              onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate()}
              autoFocus
            />
          </div>
        ) : (
          <h2 
            className="text-xl font-bold cursor-pointer hover:text-yellow-600 flex items-center gap-2"
            onClick={() => setIsEditingName(true)}
          >
            {currentBuild.name}
          </h2>
        )}
        
        <p className="text-sm text-gray-500 mt-1">
          {componentCount} composant{componentCount > 1 ? 's' : ''} sélectionné{componentCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Résumé des composants */}
      <div className="space-y-3 mb-6">
        {COMPONENT_CATEGORIES.map(category => {
          const component = currentBuild.components[category.type];
          const count = Array.isArray(component) ? component.length : (component ? 1 : 0);
          
          return (
            <div key={category.type} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-4 h-4"
                />
                <span className={category.required ? 'font-medium' : 'text-gray-600'}>
                  {category.name}
                </span>
                {category.required && !component && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 border-0 ${
                count > 0 
                  ? 'bg-green-100 text-green-800' 
                  : category.required 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600'
              }`}>
                {count > 0 ? `${count}` : '0'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Issues de compatibilité */}
      {issues.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold text-sm text-red-600">
            Problèmes détectés:
          </h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {issues.map((issue, index) => (
              <div key={index} className={`text-xs p-2 border-0 ${
                issue.type === 'error' 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-yellow-50 text-yellow-700'
              }`}>
                {issue.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prix total */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-red-600">
            {getTotalPrice().toLocaleString()} MAD
          </span>
        </div>
        
        {getTotalPrice() > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Prix unitaires, remises possibles au panier
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={hasErrors || getTotalPrice() === 0 || isAddingToCart}
          className="w-full bg-green-600 text-white py-3 px-4 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium border-0"
        >
          {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
        </button>
        
        <button
          onClick={handleSave}
          disabled={getTotalPrice() === 0}
          className="w-full bg-yellow-500 text-white py-2 px-4 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors border-0"
        >
          Sauvegarder
        </button>
        
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir vider la configuration ?')) {
              clearBuild();
            }
          }}
          disabled={getTotalPrice() === 0}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 hover:bg-gray-200 disabled:bg-gray-50 transition-colors border-0"
        >
          Vider
        </button>
      </div>

      {hasErrors && (
        <div className="mt-4 p-3 bg-red-50 border-0">
          <p className="text-xs text-red-600 text-center">
            Corrigez les erreurs de compatibilité avant d&apos;ajouter au panier
          </p>
        </div>
      )}
      
      {getTotalPrice() === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border-0">
          <p className="text-xs text-blue-600 text-center">
            Commencez par sélectionner vos composants
          </p>
        </div>
      )}
    </div>
  );
}