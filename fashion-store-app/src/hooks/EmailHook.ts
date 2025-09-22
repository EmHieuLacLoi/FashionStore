import { sendEmail } from "@services/EmailService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["sendEmail"],
      });
    },
  });
};
