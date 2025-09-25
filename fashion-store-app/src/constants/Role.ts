import type { TFunction } from "i18next";

export const RoleStatus = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
};

export const RoleStatusColor = (t: TFunction) => ({
  [RoleStatus.ADMIN]: {
    label: t("common.constant.ADMIN"),
    color: "bg-blue-200 text-blue-800",
  },
  [RoleStatus.USER]: {
    label: t("common.constant.USER"),
    color: "bg-amber-100 text-amber-800",
  },
});
