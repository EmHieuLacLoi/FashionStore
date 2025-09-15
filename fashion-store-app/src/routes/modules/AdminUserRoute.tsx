import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminUser = lazy(() => import("@views/Admin/User/index"));

export const adminUser: RouteObject[] = [
  { path: "users", element: <AdminUser /> },
];
