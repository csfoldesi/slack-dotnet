import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Member } from "../types";
import { AxiosError } from "axios";

type UpdateMembershipRequest = {
  workspaceId: string;
  userId: string;
  role: string;
};

export const useUpdateMembership = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Member, AxiosError, UpdateMembershipRequest>({
    mutationFn: ({ workspaceId, userId, role }: UpdateMembershipRequest) =>
      client.patch(`/member/${workspaceId}`, { userId, role }).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMember"] });
      queryClient.invalidateQueries({ queryKey: ["GetMembers"] });
    },
  });

  return { updateMembership: mutation.mutateAsync, isPending: mutation.isPending };
};
