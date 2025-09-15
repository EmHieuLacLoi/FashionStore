import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminProduct = lazy(() => import("@views/Admin/Product/index"));

export const adminProduct: RouteObject[] = [
  { path: "products", element: <AdminProduct /> },
];
