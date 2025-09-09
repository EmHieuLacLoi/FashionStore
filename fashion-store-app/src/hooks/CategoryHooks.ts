import { getList, create, update, deleteData } from "@services/CategoryService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CategoryServerStateKeysEnum = {
  Items: "Categories",
};

export const useGetCategoryList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [CategoryServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [CategoryServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [CategoryServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [CategoryServerStateKeysEnum.Items],
      });
    },
  });
};
