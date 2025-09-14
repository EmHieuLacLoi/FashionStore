import type { RouteObject } from "react-router";
import { lazy } from "react";

const ProfilePage = lazy(() => import("@views/Profile/index"));

export const profilePageRoute: RouteObject[] = [
  { path: "/profile", element: <ProfilePage /> },
];
