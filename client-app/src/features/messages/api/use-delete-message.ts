import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { Message } from "../types";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Message, AxiosError, string>({
    mutationFn: (messageId: string) => client.delete(`/message/${messageId}`).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] });
    },
  });

  return { deleteMessage: mutation.mutateAsync, isPending: mutation.isPending };
};
