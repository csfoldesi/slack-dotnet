import { useQuery } from "@tanstack/react-query";
import { Message } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";

export const useGetMessage = (messageId: string) => {
  return useQuery<Message, AxiosError>({
    queryKey: ["GetMessage", messageId],
    queryFn: () => client.get(`/message/${messageId}`).then((res) => res.data.data),
  });
};
