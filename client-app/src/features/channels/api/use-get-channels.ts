import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { client } from "@/client";
import { Channel } from "../types";

export const useGetChannels = (workspaceId: string) => {
  return useQuery<Channel[], AxiosError>({
    queryKey: ["GetChannels", workspaceId],
    retry: false,
    queryFn: () =>
      client
        .get(`/channel/list?workspaceId=${workspaceId}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((error: AxiosError) => {
          throw error;
        }),
  });
};
