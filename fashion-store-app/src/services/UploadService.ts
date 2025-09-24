import axiosInstance from "./AxiosInstance";

export const uploadImage = async (data: any) => {
  const response = await axiosInstance.post("api/v1/uploads/image", data);
  return response.data;
};
