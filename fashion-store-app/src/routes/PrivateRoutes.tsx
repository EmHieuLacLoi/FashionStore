import type { RouteObject } from "react-router";
import { Navigate } from "react-router";

import MainLayout from "@layouts/MainLayout/MainLayout";

export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Navigate to="/project" replace /> }],
  },
];
