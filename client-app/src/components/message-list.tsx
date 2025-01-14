import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { Loader } from "lucide-react";
import { ChannelHero } from "@/features/channels/components/channel-hero";
import { ConversationHero } from "@/features/conversations/components/conversation-hero";
import { Message as MessageType } from "@/features/messages/types";
import { Message } from "./message";
import { useAuthStore } from "@/features/auth/store";

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
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuthStore();

  const groupMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  };

  const isCompact = (message: MessageType, previousMessage: MessageType): boolean => {
    return (
      message &&
      previousMessage &&
      previousMessage.authorId === message.authorId &&
      differenceInMinutes(new Date(message.createdAt), new Date(previousMessage.createdAt)) < TIME_TRESHOLD
    );
  };

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => (
            <Message
              key={message.id}
              id={message.id}
              authorId={message.authorId}
              authorImage={message.authorAvatar}
              authorName={message.authorName}
              isAuthor={message.authorId === user?.id}
              reactions={[]}
              body={message.body}
              image={message.image}
              updatedAt={message.updatedAt}
              createdAt={message.createdAt}
              isEditing={editingId === message.id}
              setEditingId={setEditingId}
              isCompact={isCompact(message, messages[index - 1])}
              hideThreadButton={variant === "thread"}
              threadCount={0}
              threadImage={undefined}
              threadName={undefined}
              threadTimestamp={0}
            />
          ))}
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
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && <ConversationHero name={memberName} image={memberImage} />}
    </div>
  );
};
