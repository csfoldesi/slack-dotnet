import { useQuery } from "@tanstack/react-query";
import { Member } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

export const useGetMembership = (workspaceId: string) => {
  return useQuery<Member, AxiosError>({
    queryKey: ["GetMembership", workspaceId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => client.get(`/member/${workspaceId}`).then((res) => res.data.data),
  });
};
