import { getList, create, update, deleteData } from "@services/ReviewService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ReviewServerStateKeysEnum = {
  Items: "Reviews",
};

export const useGetReviewList = (params: any, config: object): any => {
  return useQuery({
    queryKey: [ReviewServerStateKeysEnum.Items, params],
    queryFn: () => getList(params),
    ...config,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ReviewServerStateKeysEnum.Items],
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ReviewServerStateKeysEnum.Items],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ReviewServerStateKeysEnum.Items],
      });
    },
  });
};
