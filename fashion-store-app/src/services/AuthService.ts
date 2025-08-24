import axiosInstance from "@services/AxiosInstance";
export const login = async (data: { username: string; password: string }) => {
  const response = await axiosInstance.post("v1/auth/login", data);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get("v1/auth/info");
  return response.data;
};

export const logout = async (username: string) => {
  const response = await axiosInstance.post("v1/auth/logout", {
    username,
  });
  return response.data;
};
