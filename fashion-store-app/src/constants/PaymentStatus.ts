import type { TFunction } from "i18next";

export const PaymentStatus = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
};

export const PaymentStatusColor = (t: TFunction) => ({
  [PaymentStatus.PENDING]: {
    label: t("payment.constant.PENDING"),
    color: "bg-blue-200 text-blue-800",
  },
  [PaymentStatus.COMPLETED]: {
    label: t("payment.constant.COMPLETED"),
    color: "bg-amber-100 text-amber-800",
  },
  [PaymentStatus.FAILED]: {
    label: t("payment.constant.FAILED"),
    color: "bg-red-100 text-red-800",
  },
});
