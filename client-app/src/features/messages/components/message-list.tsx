import { useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "@/features/messages/components/message";
import { ChannelHero } from "@/features/channels/components/channel-hero";
import { ConversationHero } from "@/features/conversations/components/conversation-hero";
import { Message as MessageType } from "@/features/messages/types";
import { useAuthStore } from "@/features/auth/store";
import { MessageProvider } from "@/features/messages/store/message-provider";

const TIME_TRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: MessageType[] | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data: messages,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const { user } = useAuthStore();
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && canLoadMore) {
        loadMore();
      }
    });

    const current = loaderRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [canLoadMore, loadMore]);

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  };

  const isCompact = (message: MessageType, nextMessage: MessageType): boolean => {
    return (
      message &&
      nextMessage &&
      nextMessage.authorId === message.authorId &&
      differenceInMinutes(message.createdAt, nextMessage.createdAt) < TIME_TRESHOLD
    );
  };

  const isNewDay = (message: MessageType, nextMessage: MessageType): boolean => {
    return !nextMessage || format(message.createdAt, "yyyy-MM-dd") !== format(nextMessage.createdAt, "yyyy-MM-dd");
  };

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {messages?.map((message, index) => (
        <div key={message.id}>
          {isNewDay(message, messages[index + 1]) && (
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(message.createdAt)}
              </span>
            </div>
          )}
          <MessageProvider message={message}>
            <Message
              key={message.id}
              isAuthor={message.authorId === user?.id}
              isCompact={isCompact(message, messages[index + 1])}
              hideThreadButton={variant === "thread"}
            />
          </MessageProvider>
        </div>
      ))}
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      <div ref={loaderRef}>
        {variant === "channel" && channelName && channelCreationTime && (
          <ChannelHero name={channelName} creationTime={channelCreationTime} />
        )}
        {variant === "conversation" && <ConversationHero name={memberName} image={memberImage} />}
      </div>
    </div>
  );
};
