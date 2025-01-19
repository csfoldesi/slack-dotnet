import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateOrGetConversation } from "../api/use-create-or-get-conversation";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { AlertTriangle } from "lucide-react";
import { Conversation } from "./conversation";

export const ConversationPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const { conversation, createOrGetConversation, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    createOrGetConversation({ workspaceId, userId: memberId });
  }, [createOrGetConversation, memberId, workspaceId]);

  if (isPending) {
    return <Loader />;
  }

  if (!conversation) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    );
  }

  return <Conversation id={conversation.id} />;
};
