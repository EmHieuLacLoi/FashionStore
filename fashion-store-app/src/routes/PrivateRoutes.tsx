import type { RouteObject } from "react-router";
import AdminLayout from "@layouts/AdminLayout/AdminLayout";
import { adminCategory } from "@routes/modules/AdminCategoryRoute";
import { adminOrder } from "@routes/modules/AdminOrderRoute";
import { adminPayment } from "@routes/modules/AdminPaymentRoute";
import { adminProduct } from "@routes/modules/AdminProductRoute";
import { adminUser } from "@routes/modules/AdminUserRoute";
export const privateRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      ...adminCategory,
      ...adminOrder,
      ...adminPayment,
      ...adminProduct,
      ...adminUser,
    ],
  },
];
