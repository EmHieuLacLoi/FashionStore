import { getList, create, update, deleteData } from "@services/ProductService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ProductServerStateKeysEnum = {
  Items: "Products",
};

export const useGetProductList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [ProductServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ProductServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ProductServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ProductServerStateKeysEnum.Items],
      });
    },
  });
};
