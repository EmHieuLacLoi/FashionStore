import { login, getUserInfo } from "@services/AuthService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ServerStateKeysEnum = {
  Items: "Auth",
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [ServerStateKeysEnum.Items] });
    },
  });
};

export const useGetUserInfo = (config: object): any => {
  return useQuery({
    queryKey: [ServerStateKeysEnum.Items],
    queryFn: getUserInfo,
    ...config,
  });
};
