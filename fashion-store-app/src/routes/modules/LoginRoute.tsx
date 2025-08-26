import type { RouteObject } from "react-router";
import { lazy } from "react";
const Login = lazy(() => import("@views/Login/index"));

export const loginRoute: RouteObject[] = [
  { path: "login", element: <Login /> },
];
