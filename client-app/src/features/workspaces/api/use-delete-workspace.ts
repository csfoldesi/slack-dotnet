import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Workspace } from "../types";
import { AxiosError } from "axios";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Workspace, AxiosError, string>({
    mutationFn: (id: string) => client.delete(`/workspace/${id}`).then((res) => res.data.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["GetWorkspace", variables],
      });
      queryClient.invalidateQueries({
        queryKey: ["GetWorkspaces"],
      });
    },
  });

  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
