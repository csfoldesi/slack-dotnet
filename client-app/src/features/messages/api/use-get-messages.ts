import { useQuery } from "@tanstack/react-query";
import { Message } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";
import { PagedList } from "@/api/types";

export const useGetMessages = (channelId: string) => {
  return useQuery<PagedList<Message>, AxiosError>({
    queryKey: ["GetMessages", channelId],
    queryFn: () => client.get(`/message?channelId=${channelId}`).then((res) => res.data.data),
  });
};
