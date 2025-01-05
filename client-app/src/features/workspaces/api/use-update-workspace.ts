import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Workspace } from "../types";
import { AxiosError } from "axios";

type UpdateWorkspaceRequest = {
  id: string;
  name?: string;
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Workspace, AxiosError, UpdateWorkspaceRequest>({
    mutationFn: (data: UpdateWorkspaceRequest) =>
      client.patch(`/workspace/${data.id}`, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspace"] });
    },
  });

  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
