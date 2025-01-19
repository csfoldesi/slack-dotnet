import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { CreateMessageRequest, Message } from "../types";

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Message, AxiosError, CreateMessageRequest>({
    mutationFn: (request: CreateMessageRequest) => client.post("/message", request).then((res) => res.data.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] });
    },
  });

  return { createMessage: mutation.mutateAsync, isPending: mutation.isPending };
};
