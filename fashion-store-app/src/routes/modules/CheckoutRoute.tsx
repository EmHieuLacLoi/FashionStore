import type { RouteObject } from "react-router";
import CheckoutPage from "@views/CheckoutPage/CheckoutPage";

export const checkoutRoute: RouteObject[] = [
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
];
