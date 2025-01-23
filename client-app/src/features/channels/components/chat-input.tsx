import { Editor } from "@/components/editor";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useUploadImage } from "@/features/messages/api/use-uppload-image";
import { CreateMessageRequest } from "@/features/messages/types";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ChatInputProps {
  placeholder: string;
  conversationId?: string;
}

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { createMessage } = useCreateMessage();
  const { uploadImage } = useUploadImage();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      let values: CreateMessageRequest = {
        workspaceId,
        conversationId,
        body,
        imageId: undefined,
      };
      if (channelId) {
        values = { channelId, ...values };
      }

      if (image) {
        const imageId = await uploadImage(image);
        if (imageId) {
          values.imageId = imageId;
        }
      }
      createMessage(values)
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

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        placeHolder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
