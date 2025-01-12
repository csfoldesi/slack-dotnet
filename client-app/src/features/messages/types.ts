export type Message = {
  body: string;
  image?: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?: string;
  createdAt: number;
  updatedAt: number;
};

export type CreateMessageRequest = {
  body: string;
  image?: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?: string;
};
