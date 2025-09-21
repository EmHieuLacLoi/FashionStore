import type { RouteObject } from "react-router";
import CartPage from "@views/CartPage/CartPage";

export const cartRoute: RouteObject[] = [
  {
    path: "/cart",
    element: <CartPage />,
  },
];
