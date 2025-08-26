import type { RouteObject } from "react-router";
import { lazy } from "react";
const Register = lazy(() => import("@views/Register/index"));

export const registerRoute: RouteObject[] = [
  { path: "register", element: <Register /> },
];
