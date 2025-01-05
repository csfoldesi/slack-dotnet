import { useQuery } from "@tanstack/react-query";
import { Workspace } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

type Response = Workspace;

export const useGetWorkspace = (workspaceId?: string) => {
  return useQuery<Response, AxiosError>({
    queryKey: ["GetWorkspace", workspaceId],
    queryFn: () => client.get(`/workspace/${workspaceId}`).then((res) => res.data.data),
  });
};
