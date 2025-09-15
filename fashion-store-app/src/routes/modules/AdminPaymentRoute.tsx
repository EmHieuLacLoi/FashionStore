import type { RouteObject } from "react-router";
import { lazy } from "react";
const AdminPayment = lazy(() => import("@views/Admin/Payment/index"));

export const adminPayment: RouteObject[] = [
  { path: "payments", element: <AdminPayment /> },
];
