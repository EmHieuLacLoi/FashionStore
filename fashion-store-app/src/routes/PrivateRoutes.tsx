import type { RouteObject } from "react-router";
import AdminLayout from "@layouts/AdminLayout/AdminLayout";
export const privateRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
  },
];
