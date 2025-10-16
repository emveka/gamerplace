// components/pcbuilder/ComponentSelector.tsx
'use client';

import { useState } from 'react';
import { PCComponent, ComponentType } from '@/types/pcbuilder';
import { usePCBuilderStore } from '@/stores/pcBuilderStore';

interface ComponentSelectorProps {
  componentType: ComponentType;
  components: PCComponent[];
  onSelect: (component: PCComponent) => void;
  onClose: () => void;
}

export function ComponentSelector({ 
  componentType, 
  components, 
  onSelect, 
  onClose 
}: ComponentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');

  const filteredComponents = components
    .filter(comp => 
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-6xl w-full max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Choisir un composant</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
              className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            >
              <option value="price">Prix croissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[65vh] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                onClick={() => onSelect(component)}
                className="border border-gray-200 p-4 hover:border-yellow-500 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex gap-4">
                  {component.imageUrl && (
                    <img
                      src={component.imageUrl}
                      alt={component.title}
                      className="w-24 h-24 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                      {component.title}
                    </h3>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <span className="text-lg font-bold text-yellow-600">
                        {component.price.toLocaleString()} MAD
                      </span>
                      <span className={`text-xs px-2 py-1 ${
                        component.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {component.stock > 0 ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Aucun composant trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
