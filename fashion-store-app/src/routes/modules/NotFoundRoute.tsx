import type { RouteObject } from "react-router";
import { lazy } from "react";
const NotFound = lazy(() => import("@views/NotFound/NotFoundPage"));

export const notFoundRoute: RouteObject[] = [
  { path: "*", element: <NotFound /> },
];
