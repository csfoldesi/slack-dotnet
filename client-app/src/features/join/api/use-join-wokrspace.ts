import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { Workspace } from "@/features/workspaces/types";
import { JoinRequest } from "../types";

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Workspace, AxiosError, JoinRequest>({
    mutationFn: (request: JoinRequest) =>
      client.post(`/workspace/${request.workspaceId}/join`, request).then((res) => res.data.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspaces"] });
      queryClient.invalidateQueries({ queryKey: ["GetMembership", variables.workspaceId] });
    },
  });

  return { joinWorkspace: mutation.mutateAsync, isPending: mutation.isPending };
};
