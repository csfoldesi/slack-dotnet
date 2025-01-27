import { useMemberId } from "@/hooks/use-member-id";
import { MessageList } from "@/features/messages/components/message-list";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "@/components/loader";
import { ConversationHeader } from "./conversation-header";
import { ChatInput } from "@/features/channels/components/chat-input";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMembership } from "@/features/workspaces/api/use-get-membership";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

interface ConversationProps {
  id: string;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const { onOpenProfile } = usePanel();
  const { data: member, isLoading: memberLoading } = useGetMembership({ workspaceId, userId: memberId });
  const { data: messages, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMessages({ conversationId: id });

  const status = "";

  if (memberLoading || status === "LoadingFirstPage") {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.name}
        memberImage={member?.avatar}
        onClick={() => {
          onOpenProfile(memberId);
        }}
      />
      <MessageList
        data={messages}
        variant="conversation"
        memberImage={member?.avatar}
        memberName={member?.name}
        loadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
        canLoadMore={hasNextPage}
      />
      <ChatInput placeholder={`Message ${member?.name}`} conversationId={id} />
    </div>
  );
};
