import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "./api/use-get-channel";
import { Loader } from "@/components/loader";
import { TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./components/chat-input";
import { MessageList } from "@/components/message-list";

export const ChannelLayout = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: isChannelLoading, error } = useGetChannel(channelId);
  //const { results, status, loadMore } = useGetMessages({ channelId });
  //const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (isChannelLoading /*|| status === "LoadingFirstPage"*/) {
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
        channelCreationTime={0}
        data={[]}
        loadMore={() => {}}
        isLoadingMore={false}
        canLoadMore={true}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};
