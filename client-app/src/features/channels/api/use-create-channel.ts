import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { Channel } from "../types";

type Request = {
  workspaceId: string;
  name: string;
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Channel, AxiosError, Request>({
    mutationFn: (data: Request) => client.post("/channel", data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["GetWorkspace"]})
    }
  });

  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
