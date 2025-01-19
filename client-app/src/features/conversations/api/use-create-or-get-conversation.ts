import { useMutation } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { Conversation } from "../types";

type CreateOrGetConversationRequest = {
  workspaceId: string;
  userId: string;
};

export const useCreateOrGetConversation = () => {
  //const queryClient = useQueryClient();

  const mutation = useMutation<Conversation, AxiosError, CreateOrGetConversationRequest>({
    mutationFn: (request: CreateOrGetConversationRequest) =>
      client.post("/conversation", request).then((res) => res.data.data),
    /*onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages", variables.channelId] });
    },*/
  });

  return { createOrGetConversation: mutation.mutateAsync, isPending: mutation.isPending, conversation: mutation.data };
};
