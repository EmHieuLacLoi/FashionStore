import type { TFunction } from "i18next";

export const OrderStatus = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

export const OrderStatusColor = (t: TFunction) => ({
  [OrderStatus.PENDING]: {
    label: t("order.constant.PENDING"),
    color: "bg-blue-200 text-blue-800",
  },
  [OrderStatus.PROCESSING]: {
    label: t("order.constant.PROCESSING"),
    color: "bg-yellow-100 text-yellow-800",
  },
  [OrderStatus.SHIPPED]: {
    label: t("order.constant.SHIPPED"),
    color: "bg-purple-100 text-purple-800",
  },
  [OrderStatus.COMPLETED]: {
    label: t("order.constant.COMPLETED"),
    color: "bg-green-100 text-green-800",
  },
  [OrderStatus.CANCELLED]: {
    label: t("order.constant.CANCELLED"),
    color: "bg-red-100 text-red-800",
  },
});
