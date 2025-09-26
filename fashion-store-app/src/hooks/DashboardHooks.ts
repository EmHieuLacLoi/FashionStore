import { getData } from "@services/DashboardService";
import { useQuery } from "@tanstack/react-query";

export const DashboardServerStateKeysEnum = {
  Items: "Dashboard",
};

export const useGetDashboardData = (config: object): any => {
  return useQuery({
    queryKey: [DashboardServerStateKeysEnum.Items],
    queryFn: () => getData(),
    ...config,
  });
};
