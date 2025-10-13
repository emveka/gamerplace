// components/cart/ShippingSelector.tsx
'use client';

import { useState } from 'react';
import { SHIPPING_CITIES, getCitiesByRegion, calculateShippingCost, getDeliveryTime, DEFAULT_SHIPPING_PRICE, DEFAULT_DELIVERY_TIME } from '@/utils/shipping';

interface ShippingSelectorProps {
  selectedCity: string;
  onCityChange: (cityCode: string) => void;
  className?: string;
}

export function ShippingSelector({ selectedCity, onCityChange, className = '' }: ShippingSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const citiesByRegion = getCitiesByRegion();
  
  const selectedCityInfo = SHIPPING_CITIES.find(city => city.code === selectedCity);
  const shippingCost = calculateShippingCost(selectedCity);
  const deliveryTime = getDeliveryTime(selectedCity);

  const handleCitySelect = (cityCode: string) => {
    onCityChange(cityCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ville de livraison
      </label>
      
      {/* Sélecteur de ville */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 px-4 py-3 text-left cursor-pointer hover:border-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-900">
                {selectedCityInfo ? selectedCityInfo.name : 'Autre ville'}
              </div>
              <div className="text-sm text-gray-600">
                {shippingCost} DH - Livraison {deliveryTime}
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Dropdown des villes */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-96 overflow-y-auto">
            
            {/* Villes par région */}
            {Object.entries(citiesByRegion).map(([region, cities]) => (
              <div key={region}>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
                  {region}
                </div>
                {cities.map((city) => (
                  <button
                    key={city.code}
                    type="button"
                    onClick={() => handleCitySelect(city.code)}
                    className={`w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors border-b border-gray-100 ${
                      selectedCity === city.code ? 'bg-yellow-50 text-yellow-800' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-600">
                          Livraison {city.deliveryTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-600">{city.price} DH</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {/* Option "Autre ville" */}
            <button
              type="button"
              onClick={() => handleCitySelect('other')}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedCity === 'other' ? 'bg-gray-50 text-gray-800' : 'text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Autre ville</div>
                  <div className="text-sm text-gray-600">
                    Livraison {DEFAULT_DELIVERY_TIME}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-600">{DEFAULT_SHIPPING_PRICE} DH</div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Info Cathedis */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span className="text-sm font-medium text-blue-800">Livraison par Cathedis</span>
        </div>
        <p className="text-xs text-blue-700">
          Service de livraison professionnel avec suivi en temps réel. 
          Paiement à la livraison disponible selon la ville.
        </p>
      </div>

      {/* Fermer le dropdown si on clique à l'extérieur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}