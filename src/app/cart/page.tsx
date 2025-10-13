// app/cart/page.tsx
import { Metadata } from 'next';
import { CartPageContent } from '@/components/cart/CartPageContent';

export const metadata: Metadata = {
  title: 'Mon Panier | Gamerplace.ma',
  description: 'Consultez votre panier d\'achat et finalisez votre commande sur Gamerplace.ma',
  robots: 'noindex, nofollow', // Pas d'indexation pour les pages de panier
};

export default function CartPage() {
  return <CartPageContent />;
}