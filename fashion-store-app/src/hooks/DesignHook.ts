import { getList, create, update, deleteData } from "@services/DesignService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const DesignServerStateKeysEnum = {
  Items: "Designs",
};

export const useGetDesignList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [DesignServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreateDesign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [DesignServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdateDesign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [DesignServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeleteDesign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [DesignServerStateKeysEnum.Items],
      });
    },
  });
};
