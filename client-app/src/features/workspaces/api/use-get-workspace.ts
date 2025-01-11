import { useQuery } from "@tanstack/react-query";
import { Workspace } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

type Response = Workspace;

export const useGetWorkspace = (workspaceId?: string) => {
  return useQuery<Response, AxiosError>({
    queryKey: ["GetWorkspace", workspaceId],
    queryFn: async () => {
      const res = await client.get(`/workspace/${workspaceId}`);
      return res.data.data;
    },
  });
};
