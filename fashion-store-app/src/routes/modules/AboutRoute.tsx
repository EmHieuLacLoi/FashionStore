import type { RouteObject } from "react-router";
import AboutUsPage from "@views/AboutUsPage/AboutUsPage";

export const aboutRoute: RouteObject[] = [
  {
    path: "/about",
    element: <AboutUsPage />,
  },
];
