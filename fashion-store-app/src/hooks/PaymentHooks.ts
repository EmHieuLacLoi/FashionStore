import { getList, create, update, deleteData } from "@services/PaymentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const PaymentServerStateKeysEnum = {
  Items: "Payments",
};

export const useGetPaymentList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [PaymentServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [PaymentServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [PaymentServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [PaymentServerStateKeysEnum.Items],
      });
    },
  });
};
