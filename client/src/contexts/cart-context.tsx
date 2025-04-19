import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (cartItem: CartItem) => void;
  updateCartItem: (itemId: number, quantity: number) => void;
  removeCartItem: (itemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const { toast } = useToast();

  // Fetch cart from API on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // For demo purposes, using userId = 1
        const userId = 1;
        const response = await fetch(`/api/cart/${userId}`, {
          credentials: "include"
        });

        if (response.ok) {
          const cartData = await response.json();
          setCart(cartData);
        } else {
          // If no cart exists, initialize an empty one
          setCart({
            items: [],
            totalItems: 0,
            totalAmount: 0
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        // Initialize an empty cart on error
        setCart({
          items: [],
          totalItems: 0,
          totalAmount: 0
        });
      }
    };

    fetchCart();
  }, []);

  const recalculateCartTotals = (items: CartItem[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => {
      const price = item.product?.discountPrice || item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    return {
      items,
      totalItems,
      totalAmount
    };
  };

  const addToCart = (newItem: CartItem) => {
    if (!cart) return;

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === newItem.productId);

    if (existingItemIndex !== -1) {
      // Update quantity if the item already exists
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      
      const updatedCart = recalculateCartTotals(updatedItems);
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const updatedItems = [...cart.items, newItem];
      const updatedCart = recalculateCartTotals(updatedItems);
      setCart(updatedCart);
    }
  };

  const updateCartItem = (itemId: number, quantity: number) => {
    if (!cart) return;

    if (quantity <= 0) {
      removeCartItem(itemId);
      return;
    }

    const updatedItems = cart.items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    const updatedCart = recalculateCartTotals(updatedItems);
    setCart(updatedCart);
  };

  const removeCartItem = (itemId: number) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(item => item.id !== itemId);
    const updatedCart = recalculateCartTotals(updatedItems);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalAmount: 0
    });
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
