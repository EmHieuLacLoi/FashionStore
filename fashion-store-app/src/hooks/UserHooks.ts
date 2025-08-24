import {
  getList,
  create,
  update,
  deleteData,
  deleteMultipleData,
} from "@services/UserService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ServerStateKeysEnum = {
  Items: "Users",
};

export const useGetList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [ServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [ServerStateKeysEnum.Items] });
    },
  });
};

export const useUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [ServerStateKeysEnum.Items] });
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [ServerStateKeysEnum.Items] });
    },
  });
};

export const useMultipleDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: Array<number>) => deleteMultipleData(ids),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [ServerStateKeysEnum.Items] });
    },
  });
};
