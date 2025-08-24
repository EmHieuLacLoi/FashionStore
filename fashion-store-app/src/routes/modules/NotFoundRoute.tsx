import type { RouteObject } from "react-router";
import { lazy } from "react";
const NotFound = lazy(() => import("@views/NotFound/index"));

export const notFoundRoute: RouteObject[] = [
  { path: "*", element: <NotFound /> },
];
