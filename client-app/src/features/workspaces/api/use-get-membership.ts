import { useQuery } from "@tanstack/react-query";
import { GetMembershipRequets, Member } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

export const useGetMembership = ({ workspaceId, userId = "" }: GetMembershipRequets) => {
  return useQuery<Member, AxiosError>({
    queryKey: ["GetMembership", workspaceId, userId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => client.get(`/member/${workspaceId}?userId=${userId}`).then((res) => res.data.data),
  });
};
