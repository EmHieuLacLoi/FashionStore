import type { RouteObject } from "react-router";
import { lazy } from "react";

const ProductPage = lazy(() => import("@views/ProductPage/index"));

export const productPageRoute: RouteObject[] = [
  { path: "/products", element: <ProductPage /> },
];
