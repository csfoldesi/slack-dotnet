import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { Message, UpdateMessageRequest } from "../types";

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Message, AxiosError, UpdateMessageRequest>({
    mutationFn: (request: UpdateMessageRequest) =>
      client.patch(`/message/${request.id}`, request).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] });
    },
  });

  return { updateMessage: mutation.mutateAsync, isPending: mutation.isPending };
};
