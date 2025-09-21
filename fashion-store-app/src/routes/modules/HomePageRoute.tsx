import type { RouteObject } from "react-router";
import { lazy } from "react";
const HomePage = lazy(() => import("@views/HomePage/HomePage"));

export const homePage: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: "home", element: <HomePage /> },
];
