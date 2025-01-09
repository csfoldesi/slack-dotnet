import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { client } from "@/client";
import { Channel } from "../types";

export const useGetChannel = (channelId: string) => {
  return useQuery<Channel, AxiosError>({
    queryKey: ["GetChannel", channelId],
    retry: false,
    queryFn: () =>
      client
        .get(`/channel/${channelId}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((error: AxiosError) => {
          throw error;
        }),
  });
};
