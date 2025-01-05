import { useQuery } from "@tanstack/react-query";
import { Member } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

export const useGetMembers = (workspaceId: string) => {
  return useQuery<Member[], AxiosError>({
    queryKey: ["GetMembers", workspaceId],
    queryFn: () => client.get(`/member/list/${workspaceId}`).then((res) => res.data.data),
  });
};
