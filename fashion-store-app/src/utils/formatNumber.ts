export const formatNumber = (value: number, decimalPlaces?: number): string => {
  if (value === null || value === undefined || isNaN(value)) return "";

  return decimalPlaces !== undefined
    ? value.toFixed(decimalPlaces)
    : Math.round(value).toString();
};
