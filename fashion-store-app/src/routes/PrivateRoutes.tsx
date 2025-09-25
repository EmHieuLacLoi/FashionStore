import type { RouteObject } from "react-router";
import AdminLayout from "@layouts/AdminLayout/AdminLayout";
import { adminCategory } from "@routes/modules/AdminCategoryRoute";
import { adminDashboard } from "@routes/modules/AdminDashboard";
import { adminOrder } from "@routes/modules/AdminOrderRoute";
import { adminPayment } from "@routes/modules/AdminPaymentRoute";
import { adminProduct } from "@routes/modules/AdminProductRoute";
import { adminUser } from "@routes/modules/AdminUserRoute";
import AdminGuard from "@routes/guards/AdminGuard";
export const privateRoutes: RouteObject[] = [
  {
    element: <AdminGuard />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          ...adminDashboard,
          ...adminCategory,
          ...adminOrder,
          ...adminPayment,
          ...adminProduct,
          ...adminUser,
        ],
      },
    ],
  },
];
