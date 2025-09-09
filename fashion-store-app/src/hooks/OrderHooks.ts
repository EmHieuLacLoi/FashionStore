import { getList, create, update, deleteData } from "@services/OrderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const OrderServerStateKeysEnum = {
  Items: "Orders",
};

export const useGetOrderList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [OrderServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [OrderServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [OrderServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [OrderServerStateKeysEnum.Items],
      });
    },
  });
};
