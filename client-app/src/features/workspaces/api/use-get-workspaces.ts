import { useQuery } from "@tanstack/react-query";
import { Workspace } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

export const useGetWorkspaces = () => {
  return useQuery<Workspace[], AxiosError>({
    queryKey: ["GetWorkspaces"],
    queryFn: () => client.get("/workspace").then((res) => res.data.data),
    staleTime: 5 * 60 * 10000,
  });
};
