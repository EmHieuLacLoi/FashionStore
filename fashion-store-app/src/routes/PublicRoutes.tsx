import type { RouteObject } from "react-router";
import MainLayout from "@layouts/MainLayout/MainLayout";
import { homePage } from "@routes/modules/HomePageRoute";
import { notFoundRoute } from "@routes/modules/NotFoundRoute";
import { loginRoute } from "@routes/modules/LoginRoute";
import { registerRoute } from "@routes/modules/RegisterRoute";
import { productPageRoute } from "@routes/modules/ProductPageRoute";
import { profilePageRoute } from "@routes/modules/ProfileRoute";
import { cartRoute } from "@routes/modules/CartRoute";
import { checkoutRoute } from "@routes/modules/CheckoutRoute";
import { designRoute } from "@routes/modules/DesignRoute";
import { aboutRoute } from "@routes/modules/AboutRoute";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...homePage,
      ...loginRoute,
      ...registerRoute,
      ...productPageRoute,
      ...profilePageRoute,
      ...cartRoute,
      ...checkoutRoute,
      ...designRoute,
      ...aboutRoute,
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [...notFoundRoute],
  },
];
