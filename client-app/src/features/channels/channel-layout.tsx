import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "./api/use-get-channel";
import { Loader } from "@/components/loader";
import { TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./components/channel-header";
import { ChatInput } from "./components/chat-input";
import { MessageList } from "@/features/messages/components/message-list";
import { useGetMessages } from "../messages/api/use-get-messages";

export const ChannelLayout = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: isChannelLoading, error } = useGetChannel(channelId);
  const {
    data: messages,
    isLoading: isMessagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMessages({ channelId });

  if (isChannelLoading || isMessagesLoading) {
    return <Loader />;
  }

  if (error?.status === 404 || !channel) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel.createdAt}
        data={messages}
        loadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
        canLoadMore={hasNextPage}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};
