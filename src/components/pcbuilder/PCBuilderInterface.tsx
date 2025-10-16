// components/pcbuilder/PCBuilderInterface.tsx
'use client';

import { useState } from 'react';
import { PCComponent, ComponentType, COMPONENT_CATEGORIES } from '@/types/pcbuilder';
import { usePCBuilderStore } from '@/stores/pcBuilderStore';
import { ComponentSelector } from './ComponentSelector';
import { BuildSummary } from './BuildSummary';

interface PCBuilderInterfaceProps {
  // Mock data - en vrai vous récupéreriez ça de Firebase
  componentsData: {
    [key in ComponentType]: PCComponent[];
  };
}

export function PCBuilderInterface({ componentsData }: PCBuilderInterfaceProps) {
  const { 
    currentBuild, 
    addComponent, 
    removeComponent, 
    canAddComponent,
    getComponentCount 
  } = usePCBuilderStore();

  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | null>(null);

  const handleSelectComponent = (component: PCComponent) => {
    if (selectedComponentType) {
      addComponent(selectedComponentType, component);
      setSelectedComponentType(null);
    }
  };

  const handleAddComponent = (componentType: ComponentType) => {
    if (canAddComponent(componentType)) {
      setSelectedComponentType(componentType);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PC Builder</h1>
        <p className="text-gray-600">Assemblez votre PC Gaming personnalisé</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des composants - 2/3 de l'écran */}
        <div className="lg:col-span-2 space-y-4">
          {COMPONENT_CATEGORIES.map((category) => {
            const selectedComponents = currentBuild.components[category.type];
            const componentCount = getComponentCount(category.type);
            const canAdd = canAddComponent(category.type);

            return (
              <div key={category.type} className="bg-white shadow-sm p-6 border-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {category.name}
                        {category.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAddComponent(category.type)}
                    disabled={!canAdd}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-0 ${
                      canAdd
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    + Ajouter
                  </button>
                </div>

                {/* Composants sélectionnés */}
                <div className="space-y-3">
                  {!selectedComponents ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200">
                      <p className="text-gray-500">Aucun composant sélectionné</p>
                    </div>
                  ) : (
                    <>
                      {Array.isArray(selectedComponents) ? (
                        // Composants multiples (RAM, Stockage)
                        selectedComponents.map((component, index) => (
                          <ComponentCard
                            key={`${component.id}-${index}`}
                            component={component}
                            onRemove={() => removeComponent(category.type, component.id)}
                            showRemove={true}
                          />
                        ))
                      ) : (
                        // Composant unique
                        <ComponentCard
                          component={selectedComponents}
                          onRemove={() => removeComponent(category.type)}
                          showRemove={true}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Indicateur de limite */}
                {category.allowMultiple && category.maxItems && (
                  <div className="mt-3 text-xs text-gray-500 text-right">
                    {componentCount}/{category.maxItems} composants
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Résumé de la build - 1/3 de l'écran */}
        <div className="lg:col-span-1">
          <BuildSummary />
        </div>
      </div>

      {/* Modal de sélection de composant */}
      {selectedComponentType && (
        <ComponentSelector
          componentType={selectedComponentType}
          components={componentsData[selectedComponentType] || []}
          onSelect={handleSelectComponent}
          onClose={() => setSelectedComponentType(null)}
        />
      )}
    </div>
  );
}

// Composant pour afficher un composant sélectionné
interface ComponentCardProps {
  component: PCComponent;
  onRemove: () => void;
  showRemove: boolean;
}

function ComponentCard({ component, onRemove, showRemove }: ComponentCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border-0">
      {component.imageUrl && (
        <img
          src={component.imageUrl}
          alt={component.title}
          className="w-20 h-20 object-cover flex-shrink-0"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {component.title}
        </h4>
        
        <div className="text-lg font-semibold text-yellow-600 mb-2">
          {component.price.toLocaleString()} MAD
        </div>
      </div>
      
      <div className="text-right flex flex-col items-end">
        <div className={`text-xs px-2 py-1 mb-2 border-0 ${
          component.stock > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {component.stock > 0 ? 'En stock' : 'Rupture'}
        </div>
        
        {showRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 p-1 border-0"
            title="Retirer ce composant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}