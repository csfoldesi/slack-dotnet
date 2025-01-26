import { createContext } from "react";
import { Message } from "../types";

export const MessageContext = createContext<Message>({
  id: "",
  body: undefined,
  image: undefined,
  authorId: "",
  authorName: "",
  authorAvatar: "",
  workspaceId: "",
  channelId: undefined,
  parentMessageId: undefined,
  conversationId: undefined,
  createdAt: "",
  updatedAt: "",
  reactions: [],
  threadCount: 0,
  threadImage: undefined,
  threadAuthor: undefined,
  threadTimestamp: undefined,
});