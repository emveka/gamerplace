// services/pcBuilderService.ts
import { CartItem } from '@/stores/cartStore';
import { PCBuildComponents, PCComponent } from '@/types/pcbuilder';

export function convertPCComponentToCartItem(component: PCComponent): Omit<CartItem, 'quantity'> {
  return {
    id: `cart-${component.id}-${Date.now()}`,
    productId: component.productId,
    title: component.title,
    price: component.price,
    imageUrl: component.imageUrl,
    slug: component.slug,
    stock: component.stock,
  };
}

export function convertBuildToCartItems(components: PCBuildComponents): Omit<CartItem, 'quantity'>[] {
  const cartItems: Omit<CartItem, 'quantity'>[] = [];
  
  Object.values(components).forEach(component => {
    if (Array.isArray(component)) {
      component.forEach(comp => {
        cartItems.push(convertPCComponentToCartItem(comp));
      });
    } else if (component) {
      cartItems.push(convertPCComponentToCartItem(component));
    }
  });
  
  return cartItems;
}