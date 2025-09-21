import type { RouteObject } from "react-router";
import { lazy } from "react";

const ProductPage = lazy(() => import("@views/ProductPage/ProductPage"));
const ProductDetailPage = lazy(
  () => import("@views/ProductDetailPage/ProductDetailPage")
);

export const productPageRoute: RouteObject[] = [
  { path: "/products", element: <ProductPage /> },
  { path: "/products/:id", element: <ProductDetailPage /> },
];
