import axiosInstance from "@services/AxiosInstance";

export const getList = async (data: any) => {
  const response = await axiosInstance.get("/v1/payments", { params: data });
  return response.data;
};
export const create = async (data: any) => {
  const response = await axiosInstance.post("/v1/payments", data);
  return response.data;
};

export const update = async (data: any) => {
  const response = await axiosInstance.put("/v1/payments", data);
  return response.data;
};

export const deleteData = async (id: number) => {
  return await axiosInstance.delete(`/v1/payments/${id}`);
};
