import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Channel } from "../types";
import { AxiosError } from "axios";

type UpdateChannelRequest = {
  id: string;
  name?: string;
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Channel, AxiosError, UpdateChannelRequest>({
    mutationFn: (data: UpdateChannelRequest) => client.patch(`/channel/${data.id}`, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspace"] });
      queryClient.invalidateQueries({ queryKey: ["GetChannel"] });
    },
  });

  return { updateChannel: mutation.mutateAsync, isPending: mutation.isPending };
};
