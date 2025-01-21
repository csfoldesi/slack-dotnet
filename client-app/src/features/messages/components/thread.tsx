import { Button } from "@/components/ui/button";
import { Message } from "@/components/message";
import { Editor } from "@/components/editor";
import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import Quill from "quill";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useAuthStore } from "@/features/auth/store";
import { useCreateMessage } from "../api/use-create-message";
import { useGetMessage } from "../api/use-get-message";
import { useGetMessages } from "../api/use-get-messages";
import { CreateMessageRequest, Message as MessageType } from "../types";

const TIME_TRESHOLD = 5;

interface ThreadProps {
  messageId: string;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const loaderRef = useRef(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const { user: currentUser } = useAuthStore();
  const { data: message, isLoading: loadingMessage } = useGetMessage(messageId);
  const {
    data: groupMessages,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMessages({ channelId, parentMessageId: messageId });
  const { createMessage } = useCreateMessage();
  //const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
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
  }, [fetchNextPage, hasNextPage]);

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

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      let request: CreateMessageRequest = {
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };
      if (channelId) {
        request = { channelId, ...request };
      }
      /*if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url!, {
          method: "POST",
          headers: { "Content-type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }*/

      createMessage(request)
        .then(() => {
          setEditorKey((prevKey) => prevKey + 1);
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      editorRef.current?.enable(true);
      setIsPending(false);
    }
  };

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex justify-between items-center h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex justify-between items-center h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangleIcon className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                isAuthor={message.authorId === currentUser?.id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message.createdAt}
                isEditing={editingId === message.id}
                setEditingId={setEditingId}
                isCompact={isCompact(message, messages[index - 1])}
                hideThreadButton
                threadCount={0}
                threadImage={undefined}
                threadName={undefined}
                threadTimestamp={undefined}
              />
            ))}
          </div>
        ))}

        <div className="h-1" ref={loaderRef} />

        {isFetchingNextPage && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}

        <Message
          hideThreadButton
          authorId={message.authorId}
          authorImage={message.authorAvatar}
          authorName={message.authorName}
          isAuthor={message.authorId === currentUser?.id}
          body={message.body}
          image={message.image}
          createdAt={message.createdAt}
          updatedAt={message.updatedAt}
          id={message.id}
          reactions={message.reactions}
          isEditing={editingId === message.id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeHolder="Reply..."
        />
      </div>
    </div>
  );
};
