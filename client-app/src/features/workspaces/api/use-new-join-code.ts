import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Workspace } from "../types";
import { AxiosError } from "axios";

export const useNewJoinCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Workspace, AxiosError, string>({
    mutationFn: (workspaceId: string) =>
      client.post(`/workspace/newjoincode/${workspaceId}`, {}).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspace"] });
    },
  });

  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
