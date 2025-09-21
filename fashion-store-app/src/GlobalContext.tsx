import React, { createContext, useContext, useState } from "react";

type GlobalContextProps = {
  lang: string;
  setLang: (lang: string) => void;
  token: string;
  setToken: (token: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  updateQuantity: (key: string, qty: number) => void;
};

export type CartItem = {
  key: string; // unique key for item in cart (e.g., `${productId}-${sku}-${color}-${storage}`)
  productId: number;
  name: string;
  sku: string;
  color: string;
  storage?: string;
  price: number;
  image?: string;
  quantity: number;
};

const GlobalContext = createContext({} as GlobalContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "vi");
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + item.quantity,
        };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (key: string) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (key: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );
  };
  return (
    <GlobalContext.Provider
      value={{
        lang,
        setLang,
        token,
        setToken,
        isLoading,
        setIsLoading,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
