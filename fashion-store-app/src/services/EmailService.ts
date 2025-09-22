import axiosInstance from "@services/AxiosInstance";

export const sendEmail = async (data: any) => {
  const response = await axiosInstance.post("api/v1/emails", data);
  return response.data;
};
