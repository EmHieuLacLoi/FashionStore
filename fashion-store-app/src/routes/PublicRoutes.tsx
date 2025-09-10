import type { RouteObject } from "react-router";
import MainLayout from "@layouts/MainLayout/MainLayout";
import { homePage } from "@routes/modules/HomePageRoute";
import { notFoundRoute } from "@routes/modules/NotFoundRoute";
import { loginRoute } from "@routes/modules/LoginRoute";
import { registerRoute } from "@routes/modules/RegisterRoute";
import { productPageRoute } from "@routes/modules/ProductPageRoute";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...homePage,
      ...loginRoute,
      ...registerRoute,
      ...productPageRoute,
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [...notFoundRoute],
  },
];
