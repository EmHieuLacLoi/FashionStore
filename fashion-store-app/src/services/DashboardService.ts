import axiosInstance from "@services/AxiosInstance";

export const getData = async () => {
  const response = await axiosInstance.get("api/v1/dashboard");
  return response.data;
};
