// components/checkout/CheckoutForm.tsx - AVEC GESTION DES POINTS
'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { ShippingSelector } from '@/components/cart/ShippingSelector';

interface FormData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Adresse de livraison
  address: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
  
  // Méthode de paiement
  paymentMethod: 'online' | 'cod'; // online ou cash on delivery
  
  // Acceptation conditions
  acceptTerms: boolean;
  newsletter: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  acceptTerms?: string;
}

interface CheckoutFormProps {
  onFormChange?: (data: FormData & { shippingCity: string }) => void;
}

export function CheckoutForm({ onFormChange }: CheckoutFormProps) {
  const { hasPointsProducts, getPointsSummary } = useCartStore();
  const pointsSummary = getPointsSummary();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    additionalInfo: '',
    paymentMethod: 'cod',
    acceptTerms: false,
    newsletter: false,
  });

  const [shippingCity, setShippingCity] = useState('casa'); // Casablanca par défaut
  const [errors, setErrors] = useState<FormErrors>({});

  // Mise à jour du formulaire
  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Nettoyer l'erreur pour ce champ
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field as keyof FormErrors]: undefined });
    }
    
    // Callback vers le parent
    if (onFormChange) {
      onFormChange({ ...newData, shippingCity });
    }
  };

  // Mise à jour de la ville de livraison
  const handleShippingCityChange = (cityCode: string) => {
    setShippingCity(cityCode);
    if (onFormChange) {
      onFormChange({ ...formData, shippingCity: cityCode });
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Formulaire valide:', { ...formData, shippingCity });
      // Ici vous pouvez traiter la commande
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Informations de livraison
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Votre prénom"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Votre nom"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="06 XX XX XX XX"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Adresse de livraison
          </h3>
          
          {/* Sélecteur de ville pour livraison Cathedis */}
          <div className="mb-4">
            <ShippingSelector
              selectedCity={shippingCity}
              onCityChange={handleShippingCityChange}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Numéro, rue, quartier"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville/Quartier *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Quartier précis"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Code postal (optionnel)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                rows={3}
                placeholder="Étage, digicode, instructions particulières..."
              />
            </div>
          </div>
        </div>

        {/* Méthode de paiement avec impact sur les points */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Mode de paiement
            </h3>
            {hasPointsProducts() && (
              <span className="text-yellow-600">🎁</span>
            )}
          </div>

          {/* Alerte points selon paiement */}
          {hasPointsProducts() && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-blue-900">
                  Attribution des {pointsSummary.totalPointsToEarn} points fidélité
                </span>
              </div>
              <div className="text-sm text-blue-800">
                Le mode de paiement influence quand vous recevrez vos points :
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
              formData.paymentMethod === 'cod' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-300 hover:border-yellow-500'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={(e) => updateFormData('paymentMethod', e.target.value as 'cod')}
                className="text-yellow-500 focus:ring-yellow-500"
              />
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-900">
                  Paiement à la livraison
                </div>
                <div className="text-sm text-gray-600">
                  Payez en espèces au livreur Cathedis
                </div>
                {/* Info points pour paiement livraison */}
                {hasPointsProducts() && formData.paymentMethod === 'cod' && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-orange-600">⏳</span>
                    <span className="text-orange-700">
                      Points ajoutés après confirmation de réception
                    </span>
                  </div>
                )}
              </div>
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </label>

            <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
              formData.paymentMethod === 'online' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-300 hover:border-yellow-500'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === 'online'}
                onChange={(e) => updateFormData('paymentMethod', e.target.value as 'online')}
                className="text-yellow-500 focus:ring-yellow-500"
              />
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-900">
                  Paiement en ligne
                </div>
                <div className="text-sm text-gray-600">
                  Carte bancaire, virement (bientôt disponible)
                </div>
                {/* Info points pour paiement en ligne */}
                {hasPointsProducts() && formData.paymentMethod === 'online' && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span className="text-green-700 font-medium">
                      Points ajoutés immédiatement après paiement
                    </span>
                  </div>
                )}
              </div>
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </label>
          </div>

          {/* Récapitulatif points selon mode choisi */}
          {hasPointsProducts() && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">🎁</span>
                  <span className="text-sm font-medium text-yellow-800">
                    Avec votre mode de paiement :
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">
                    {pointsSummary.totalPointsToEarn} points
                  </div>
                  <div className="text-xs text-yellow-600">
                    ≈ {(pointsSummary.totalPointsToEarn * 0.05).toFixed(0)} DH
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-yellow-700">
                {formData.paymentMethod === 'online' 
                  ? "Attribution immédiate après paiement confirmé"
                  : "Attribution après confirmation que vous avez reçu votre commande"
                }
              </div>
            </div>
          )}
        </div>

        {/* Conditions et newsletter */}
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => updateFormData('acceptTerms', e.target.checked)}
              className="mt-0.5 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              J&apos;accepte les{' '}
              <a href="/conditions" className="text-yellow-600 hover:text-yellow-800">
                conditions générales de vente
              </a>{' '}
              et la{' '}
              <a href="/privacy" className="text-yellow-600 hover:text-yellow-800">
                politique de confidentialité
              </a>
              *
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
          )}

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => updateFormData('newsletter', e.target.checked)}
              className="mt-0.5 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Je souhaite recevoir les offres et nouveautés Gamerplace.ma
            </span>
          </label>
        </div>

        {/* Bouton de validation */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 transition-colors disabled:opacity-50"
            disabled={!formData.acceptTerms}
          >
            Confirmer ma commande
            {hasPointsProducts() && (
              <span className="ml-2">
                🎁 +{pointsSummary.totalPointsToEarn}pts
              </span>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            En confirmant, vous acceptez nos conditions générales
          </p>
        </div>
      </form>
    </div>
  );
}