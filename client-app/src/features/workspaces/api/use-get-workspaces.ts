import { useQuery } from "@tanstack/react-query";
import { Workspace } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";
import { useAuthStore } from "@/features/auth/store";

type Response = Workspace[];

export const useGetWorkspaces = () => {
  const { user } = useAuthStore();

  return useQuery<Response, AxiosError>({
    queryKey: ["GetWorkspaces", user?.email],
    queryFn: () => client.get("/workspace").then((res) => res.data.data),
  });
};
