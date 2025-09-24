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
  currentUser: any;
  setCurrentUser: (userInfo: any) => void;
  shippingFee: number;
  setShippingFee: (shippingFee: number) => void;
};

export type CartItem = {
  key: string;
  productVariantId: number;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string;
  quantity: number;
  designId?: number;
};

const GlobalContext = createContext({} as GlobalContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "vi");
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

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

      const fullImageUrls = imageUrlsArray?.map(
        (publicId: string) => `${cloudinaryUrl}${publicId}`
      );

      return {
        ...product,
        image_url: fullImageUrls,
      };
    });

    const filteredProducts = products.filter(
      (product: Product) => product.id !== 15
    );

    setAllProducts(filteredProducts);
  }, [productData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      let newCart;

      if (idx !== -1) {
        newCart = [...prev];
        newCart[idx] = {
          ...newCart[idx],
          quantity: newCart[idx].quantity + item.quantity,
        };
      } else {
        newCart = [...prev, item];
      }

      return newCart;
    });
  };

  const removeFromCart = (key: string) => {
    setCartItems((prev) => {
      const newCart = prev.filter((i) => i.key !== key);
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
        currentUser,
        setCurrentUser,
        shippingFee,
        setShippingFee,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
