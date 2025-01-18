import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Member } from "../types";
import { AxiosError } from "axios";

type DeleteMembershipRequest = {
  workspaceId: string;
  userId: string;
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Member, AxiosError, DeleteMembershipRequest>({
    mutationFn: ({ workspaceId, userId }: DeleteMembershipRequest) =>
      client.delete(`/member/${workspaceId}/${userId}`).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMember"] });
      queryClient.invalidateQueries({ queryKey: ["GetMembers"] });
      queryClient.invalidateQueries({ queryKey: ["GetWorkspaces"] });
    },
  });

  return { deleteMembership: mutation.mutateAsync, isPending: mutation.isPending };
};
