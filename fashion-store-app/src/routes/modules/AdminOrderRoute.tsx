import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminOrder = lazy(() => import("@views/Admin/Order/index"));

export const adminOrder: RouteObject[] = [
  { path: "orders", element: <AdminOrder /> },
];
