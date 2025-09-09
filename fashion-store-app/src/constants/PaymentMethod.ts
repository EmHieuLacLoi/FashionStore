import type { TFunction } from "i18next";

export const PaymentMethod = {
  MOMO: 0,
  ZALOPAY: 1,
  COD: 2,
  BANK_TRANSFER: 3,
};

export const PaymentMethodLabel = (t: TFunction) => ({
  [PaymentMethod.MOMO]: {
    label: t("payment.constant.MOMO"),
    icon: "momo.svg",
  },
  [PaymentMethod.ZALOPAY]: {
    label: t("payment.constant.ZALOPAY"),
    icon: "zalopay.svg",
  },
  [PaymentMethod.COD]: {
    label: t("payment.constant.COD"),
    icon: "cod.svg",
  },
  [PaymentMethod.BANK_TRANSFER]: {
    label: t("payment.constant.BANK_TRANSFER"),
    icon: "bank.svg",
  },
});
