import dayjs from "dayjs";

export const formatTimeAgo = (
  dateString: string,
  t: (key: string) => string
): string => {
  if (!dateString) return t("common.locales.just_now");

  const date = dayjs(dateString);
  if (!date.isValid()) return t("common.locales.just_now");

  const now = dayjs();
  const diffInMinutes = now.diff(date, "minute");
  const diffInHours = now.diff(date, "hour");
  const diffInDays = now.diff(date, "day");
  const diffInWeeks = now.diff(date, "week");
  const diffInMonths = now.diff(date, "month");
  const diffInYears = now.diff(date, "year");

  if (diffInMinutes < 1) {
    return t("common.locales.just_now");
  } else if (diffInMinutes < 60) {
    const key = diffInMinutes === 1 ? "minute" : "minutes";
    return `${diffInMinutes} ${t(`common.locales.${key}`)}`;
  } else if (diffInHours < 24) {
    const key = diffInHours === 1 ? "hour" : "hours";
    return `${diffInHours} ${t(`common.locales.${key}`)}`;
  } else if (diffInDays < 7) {
    const key = diffInDays === 1 ? "day" : "days";
    return `${diffInDays} ${t(`common.locales.${key}`)}`;
  } else if (diffInWeeks < 4) {
    const key = diffInWeeks === 1 ? "week" : "weeks";
    return `${diffInWeeks} ${t(`common.locales.${key}`)}`;
  } else if (diffInMonths < 12) {
    const key = diffInMonths === 1 ? "month" : "months";
    return `${diffInMonths} ${t(`common.locales.${key}`)}`;
  } else {
    const key = diffInYears === 1 ? "year" : "years";
    return `${diffInYears} ${t(`common.locales.${key}`)}`;
  }
};

export const formatDate = (dateString: string, format?: string): string => {
  if (!dateString) return "-";

  const date = dayjs(dateString);
  if (!date.isValid()) return "-";

  switch (format) {
    case "datetime":
      return date.format("HH:mm DD/MM/YYYY");
    case "date":
      return date.format("DD/MM/YYYY");
    case "time":
      return date.format("HH:mm:ss");
    default:
      return "-";
  }
};
