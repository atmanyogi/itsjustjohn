"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  type: 'track' | 'album' | 'gear';
  price: number;
  artwork: string;
  options?: {
    size?: string;
    color?: string;
    style?: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, options?: CartItem['options']) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('sentient_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sentient_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prev) => {
      // Check if item already exists with same options
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.options) === JSON.stringify(newItem.options)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += newItem.quantity || 1;
        return newCart;
      }

      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    
    // Track item added to cart
    try {
      const { trackLocalEvent } = require("../lib/analytics");
      trackLocalEvent("cart_item_added", {
        productId: newItem.title || newItem.id,
        properties: { type: newItem.type, price: newItem.price }
      });
    } catch (e) {}

    // Optional: Open cart when adding item
    // setIsCartOpen(true);
  };

  const removeFromCart = (id: string, options?: CartItem['options']) => {
    // Find the item first to get its info before removing
    const itemToRemove = cart.find(
      (item) => item.id === id && JSON.stringify(item.options) === JSON.stringify(options)
    );

    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && JSON.stringify(item.options) === JSON.stringify(options))
      )
    );

    // Track item removed from cart
    if (itemToRemove) {
      try {
        const { trackLocalEvent } = require("../lib/analytics");
        trackLocalEvent("cart_item_removed", {
          productId: itemToRemove.title || itemToRemove.id,
          properties: { type: itemToRemove.type, price: itemToRemove.price }
        });
      } catch (e) {}
    }
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        total, 
        isCartOpen, 
        setIsCartOpen 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
