import type { RouteObject } from "react-router";
import MainLayout from "@layouts/MainLayout/MainLayout";
import { homePage } from "@routes/modules/HomePageRoute";
import { notFoundRoute } from "@routes/modules/NotFoundRoute";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [...homePage],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [...notFoundRoute],
  },
];
