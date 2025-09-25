import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminDashboard = lazy(
  () => import("@views/Admin/Dashboard/DashboardPage")
);

export const adminDashboard: RouteObject[] = [
  { index: true, element: <AdminDashboard /> },
];
