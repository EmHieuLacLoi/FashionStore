import type { RouteObject } from "react-router";
import DesignPage from "@views/DesignPage/DesignPage";

export const designRoute: RouteObject[] = [
  {
    path: "/design",
    element: <DesignPage />,
  },
];
