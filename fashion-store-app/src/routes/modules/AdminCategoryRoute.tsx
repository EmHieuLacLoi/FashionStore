import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminCategory = lazy(() => import("@views/Admin/Category/index"));

export const adminCategory: RouteObject[] = [
  { path: "categories", element: <AdminCategory /> },
];
