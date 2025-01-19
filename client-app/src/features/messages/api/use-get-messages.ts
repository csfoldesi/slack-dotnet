import { useQuery } from "@tanstack/react-query";
import { Message } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";
import { PagedList } from "@/api/types";

type GetMessagesRequest = {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
};

export const useGetMessages = ({ channelId = "", conversationId = "", parentMessageId = "" }: GetMessagesRequest) => {
  const queryResult = useQuery<PagedList<Message>, AxiosError>({
    queryKey: ["GetMessages", channelId, conversationId, parentMessageId],
    queryFn: () =>
      client
        .get(`/message?channelId=${channelId}&conversationId=${conversationId}&parentMessageId=${parentMessageId}`)
        .then((res) => res.data.data),
  });

  return { ...queryResult };

  /*return useQuery<PagedList<Message>, AxiosError>({
    queryKey: ["GetMessages", channelId],
    queryFn: () => client.get(`/message?channelId=${channelId}`).then((res) => res.data.data),
  });*/
};
