import axiosInstance from "@services/AxiosInstance";

export const getList = async (data: any) => {
  const response = await axiosInstance.get("/v1/categories", { params: data });
  return response.data;
};
export const create = async (data: any) => {
  const response = await axiosInstance.post("/v1/categories", data);
  return response.data;
};

export const update = async (data: any) => {
  if (data.id == undefined || data.id == null || data.id == 0) {
    return;
  }
  const response = await axiosInstance.put(`/v1/categories/${data.id}`, data);
  return response.data;
};

export const deleteData = async (id: number) => {
  return await axiosInstance.delete(`/v1/categories/${id}`);
};
