import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { ToggleReactionRequest } from "../types";

export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<string, AxiosError, ToggleReactionRequest>({
    mutationFn: (request: ToggleReactionRequest) =>
      client.patch(`/message/${request.messageId}/reaction`, { value: request.value }).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] });
    },
  });

  return { toggleReaction: mutation.mutateAsync, isPending: mutation.isPending };
};
