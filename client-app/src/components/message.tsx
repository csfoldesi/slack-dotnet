import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Renderer } from "./renderer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { MessageToolbar } from "./message-toolbar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Editor } from "./editor";
import { useConfirm } from "@/hooks/use-confirm";
import { Reactions } from "./reactions";
import { ThreadBar } from "./thread-bar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import { useToggleReaction } from "@/features/messages/api/use-toggle-reaction";
import { usePanel } from "@/hooks/use-panel";
import { useContext } from "react";
import { MessageContext } from "@/features/messages/store/message-context";

interface MessageProps {
  isAuthor: boolean;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

export const Message = ({ isAuthor, isEditing, setEditingId, isCompact, hideThreadButton }: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this messagage? This cannot be undone."
  );
  const message = useContext(MessageContext);
  const { updateMessage, isPending: isMessageUpdating } = useUpdateMessage();
  const { deleteMessage, isPending: isMessageDeleting } = useDeleteMessage();
  const { toggleReaction, isPending: isReactionToggling } = useToggleReaction();
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose: onThreadPanelClose } = usePanel();

  const isPending = isMessageUpdating || isMessageDeleting || isReactionToggling;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage({ id: message.id, body })
      .then(() => {
        toast.success("Message updated");
      })
      .catch(() => {
        toast.error("Failed to update message");
      })
      .finally(() => {
        setEditingId(null);
      });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessage(message.id)
      .then(() => {
        toast.success("Message deleted");
        if (parentMessageId === message.id) {
          onThreadPanelClose();
        }
      })
      .catch(() => {
        toast.error("Failed to delete message");
      });
  };

  const handleReaction = async (value: string) => {
    toggleReaction({ messageId: message.id, value }).catch(() => {
      toast.error("Failed to toggle rection");
    });
  };

  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "H:mm:ss")}`;
  };

  const avatarFallback = message.authorName?.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isMessageDeleting && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}>
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(message.createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(message.createdAt), "HH:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(message.body!)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={message.body} />
                <Thumbnail url={message.image} />
                {message.updatedAt ? <span className="text-xs text-muted-foreground">(message.edited)</span> : null}
                <Reactions data={message.reactions} onChange={handleReaction} />
                <ThreadBar onClick={() => onOpenMessage(message.id)} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(message.id)}
              handleThread={() => onOpenMessage(message.id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isMessageDeleting && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}>
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(message.authorId)}>
            <Avatar>
              <AvatarImage src={message.authorAvatar} />
              <AvatarFallback className="text-sm">{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(message.body!)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfile(message.authorId)}
                  className="font-bold text-primary hover:underline">
                  {message.authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(message.createdAt))}>
                  <button className="text-sm text-muted-foreground hover:underline">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </button>
                </Hint>
              </div>
              <Renderer value={message.body} />
              <Thumbnail url={message.image} />
              {message.updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
              <Reactions data={message.reactions} onChange={handleReaction} />
              <ThreadBar onClick={() => onOpenMessage(message.id)} />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(message.id)}
            handleThread={() => onOpenMessage(message.id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
