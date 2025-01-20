import { useInfiniteQuery } from "@tanstack/react-query";
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
  const queryResult = useInfiniteQuery<PagedList<Message>, AxiosError>({
    queryKey: ["GetMessages", channelId, conversationId, parentMessageId],
    queryFn: ({ pageParam }) =>
      client
        .get(
          `/message?channelId=${channelId}&conversationId=${conversationId}&parentMessageId=${parentMessageId}&pageNumber=${pageParam}`
        )
        .then((res) => res.data.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.currentPage < lastPage.totalPages - 1 ? lastPage.currentPage + 1 : null),
  });

  return {
    ...queryResult,
    data: queryResult.data?.pages.reduce((acc, current) => [...acc, ...current.items], [] as Message[]),
  };

  /*return useQuery<PagedList<Message>, AxiosError>({
    queryKey: ["GetMessages", channelId],
    queryFn: () => client.get(`/message?channelId=${channelId}`).then((res) => res.data.data),
  });*/
};
