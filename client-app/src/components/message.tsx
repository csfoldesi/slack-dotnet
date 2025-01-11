import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Renderer } from "./renderer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { MessageToolbar } from "./message-toolbar";
//import { useUpdateMessage } from "@/features/messages/api/use-update-messaage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Editor } from "./editor";
//import { useRemoveMessage } from "@/features/messages/api/use-remove-messaage";
import { useConfirm } from "@/hooks/use-confirm";
//import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
//import { usePanel } from "@/hooks/use-panel";
import { Reactions } from "./reactions";
import { ThreadBar } from "./thread-bar";

interface MessageProps {
  id: string;
  memberId: string;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<{
    _id: string;
    value: string;
    count: number;
    memberIds: string[];
  }>;
  body: string;
  image: string | null | undefined;
  updatedAt: number;
  createdAt: number;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this messagage? This cannot be undone."
  );
  //const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
  //const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
  //const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();
  //const { parentMessageId, onOpenMessage, onOpenProfile, onClose: onThreadPanelClose } = usePanel();

  //const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction;
  const isPending = false;
  const isRemovingMessage = false;

  const handleUpdate = ({ body }: { body: string }) => {
    /*updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
          setEditingId(null);
        },
      }
    );*/
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    /*removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          if (parentMessageId === id) {
            onThreadPanelClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );*/
  };

  const handleReaction = async (value: string) => {
    /*toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle rection");
        },
      }
    );*/
  };

  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "H:mm:ss")}`;
  };

  const avatarFallback = authorName.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}>
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "HH:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => {}}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
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
          isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}>
        <div className="flex items-start gap-2">
          <button onClick={() => {}}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback className="text-sm">{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button onClick={() => {}} className="font-bold text-primary hover:underline">
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-sm text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "HH:mm")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? <span className="text-xs text-muted-foreground">(edited)</span> : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => {}}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
