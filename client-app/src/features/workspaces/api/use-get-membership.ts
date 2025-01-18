import { useQuery } from "@tanstack/react-query";
import { Member } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

type GetMembershipRequets = {
  workspaceId: string;
  userId?: string;
};

export const useGetMembership = ({ workspaceId, userId = "" }: GetMembershipRequets) => {
  return useQuery<Member, AxiosError>({
    queryKey: ["GetMembership", workspaceId, userId],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: () => client.get(`/member/${workspaceId}?userId=${userId}`).then((res) => res.data.data),
  });
};
