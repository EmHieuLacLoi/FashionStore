import type { TFunction } from "i18next";

export const ActiveStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
};

export const ActiveStatusColor = (t: TFunction) => ({
  [ActiveStatus.ACTIVE]: {
    label: t("common.constant.ACTIVE"),
    color: "bg-green-200 text-green-800",
  },
  [ActiveStatus.INACTIVE]: {
    label: t("common.constant.INACTIVE"),
    color: "bg-red-200 text-red-800",
  },
});
