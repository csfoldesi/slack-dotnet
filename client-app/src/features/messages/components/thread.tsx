import { Button } from "@/components/ui/button";
import { Message } from "@/features/messages/components/message";
import { Editor } from "@/features/messages/components/editor";
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
import { useUploadImage } from "../api/use-uppload-image";
import { MessageContext } from "../store/message-context";

const TIME_TRESHOLD = 5;

interface ThreadProps {
  messageId: string;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const loaderRef = useRef(null);

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const { user: currentUser } = useAuthStore();
  const { data: message, isLoading: loadingMessage } = useGetMessage(messageId);
  const {
    data: messages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMessages({ channelId, parentMessageId: messageId });
  const { createMessage } = useCreateMessage();
  const { uploadImage } = useUploadImage();

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

  const isCompact = (message: MessageType, nextMessage: MessageType): boolean => {
    return (
      message &&
      nextMessage &&
      nextMessage.authorId === message.authorId &&
      differenceInMinutes(new Date(message.createdAt), new Date(nextMessage.createdAt)) < TIME_TRESHOLD
    );
  };

  const isNewDay = (message: MessageType, nextMessage: MessageType): boolean => {
    return !nextMessage || format(message.createdAt, "yyyy-MM-dd") !== format(nextMessage.createdAt, "yyyy-MM-dd");
  };

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      let request: CreateMessageRequest = {
        workspaceId,
        parentMessageId: messageId,
        body,
        imageId: undefined,
      };
      if (channelId) {
        request = { channelId, ...request };
      }
      if (image) {
        const imageId = await uploadImage(image);
        if (imageId) {
          request.imageId = imageId;
        }
      }
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

  if (loadingMessage) {
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
            <MessageContext.Provider value={message}>
              <Message
                key={message.id}
                isAuthor={message.authorId === currentUser?.id}
                isCompact={isCompact(message, messages[index + 1])}
                hideThreadButton
              />
            </MessageContext.Provider>
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

        <MessageContext.Provider value={message}>
          <Message hideThreadButton isAuthor={message.authorId === currentUser?.id} />
        </MessageContext.Provider>
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
