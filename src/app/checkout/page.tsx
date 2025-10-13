// app/checkout/page.tsx
import { Metadata } from 'next';
import { CheckoutPageContent } from '@/components/checkout/CheckoutPageContent';

export const metadata: Metadata = {
  title: 'Finaliser ma commande | Gamerplace.ma',
  description: 'Finalisez votre commande en toute sécurité sur Gamerplace.ma',
  robots: 'noindex, nofollow', // Pas d'indexation pour les pages de checkout
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}