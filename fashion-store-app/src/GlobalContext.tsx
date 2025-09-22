import { useGetProductList } from "@hooks/ProductHooks";
import type { Product } from "@models/product.interface";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useState, useEffect } from "react";

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
  cloudinary: string;
  cloudinaryUrl: string;
  allProducts: Product[];
};

export type CartItem = {
  key: string; // unique key for item in cart (e.g., `${productId}-${sku}-${color}-${storage}`)
  productId: number;
  name: string;
  color: string;
  size: string;
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
  const [cloudinary, setCloudinary] = useState("");
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const cloudinary = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
    setCloudinary(`cloudinary://${apiKey}:${apiSecret}@${cloudinary}`);
  }, []);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { data: productData } = useGetProductList(
    {
      size: 999999999,
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      onError: (error: any) => {
        console.log(error);
        message.error(t("product_page.error.product_list"));
      },
    }
  );

  useEffect(() => {
    if (!productData || !productData?.data?.content) return;

    const products = productData.data.content.map((product: Product) => {
      const imageUrlsArray = JSON.parse(product.image_url as string);

      const fullImageUrls = imageUrlsArray.map(
        (publicId: string) => `${cloudinaryUrl}${publicId}`
      );

      return {
        ...product,
        image_url: fullImageUrls,
      };
    });

    setAllProducts(products);
  }, [productData]);

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
        cloudinary,
        cloudinaryUrl,
        allProducts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
