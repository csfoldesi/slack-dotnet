import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { Workspace } from "../types";
import { AxiosError } from "axios";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Workspace, AxiosError, string>({
    mutationFn: (name: string) => client.post("/workspace", { name }).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWorkspaces"] });
    },
  });

  return { mutateAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
