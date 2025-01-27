import { MdOutlineAddReaction } from "react-icons/md";
import { cn } from "@/lib/utils";
import { MessageReaction } from "@/features/messages/types";
import { useAuthStore } from "@/features/auth/store";
import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";

interface ReactionsProps {
  data: MessageReaction[];
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const { user } = useAuthStore();

  if (data.length === 0 || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction.value}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}>
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flerx items-center gap-x-1",
              reaction.userIds.includes(user.id) && "bg-blue-100/70 border-blue-500 text-white"
            )}
            key={reaction.value}>
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.userIds.includes(user.id) && "text-blue-500"
              )}>
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji: string) => onChange(emoji)}>
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
