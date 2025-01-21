import { useInfiniteQuery } from "@tanstack/react-query";
import { Message } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";
import { PagedList } from "@/api/types";
import { format } from "date-fns";

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

  const mergeData = (pages?: PagedList<Message>[]): Record<string, Message[]> | undefined => {
    const messages = pages?.reduce((acc, current) => [...acc, ...current.items], [] as Message[]);

    return messages?.reduce(
      (groups, message) => {
        const date = new Date(message.createdAt);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
      },
      {} as Record<string, Message[]>
    );
  };

  return {
    ...queryResult,
    data: mergeData(queryResult.data?.pages),
  };
};
