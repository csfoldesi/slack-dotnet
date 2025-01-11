import { MessageSquareTextIcon, PencilIcon, SmileIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji: string) => handleReaction(emoji)}>
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in therad">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleThread}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
              <PencilIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleDelete}>
              <TrashIcon className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
