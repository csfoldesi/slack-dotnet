import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Channel } from "../types";
import { AxiosError } from "axios";

type DelteChannelRequest = {
  workspaceId: string;
  channelId: string;
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Channel, AxiosError, DelteChannelRequest>({
    mutationFn: (request: DelteChannelRequest) =>
      client.delete(`/channel/${request.channelId}`).then((res) => res.data.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspace", variables.workspaceId] });
      //queryClient.invalidateQueries({ queryKey: ["GetChannel", variables.channelId] });
    },
  });

  return { deleteChannel: mutation.mutateAsync, isPending: mutation.isPending };
};
