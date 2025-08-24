import axiosInstance from "@services/AxiosInstance";

export const getList = async (data: any) => {
  const response = await axiosInstance.get("/v1/role", { params: data });
  return response.data;
};

export const getDetail = async (data: any) => {
  const response = await axiosInstance.get(`/v1/role/${data.id}`, {
    params: data,
  });
  return response.data;
};

export const insert = async (data: any) => {
  const response = await axiosInstance.post("/v1/role", { ...data });
  return response.data;
};

export const update = async (data: any) => {
  const response = await axiosInstance.put(`/v1/role/${data.id}`, { ...data });
  return response.data;
};
