export type Message = {
  id: string;
  body?: string;
  image?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  reactions: MessageReaction[];
  threadCount: number;
  threadImage?: string;
  threadAuthor?: string;
  threadTimestamp?: string;
};

export type CreateMessageRequest = {
  body?: string;
  imageId?: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?: string;
};

export type UpdateMessageRequest = {
  id: string;
  body?: string;
  image?: string;
};

export type ToggleReactionRequest = {
  messageId: string;
  value: string;
};

export type MessageReaction = {
  value: string;
  count: number;
  userIds: string[];
};
