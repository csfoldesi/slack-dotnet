import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useCreteChannelModal } from "@/features/workspaces/store";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNavigate } from "@tanstack/react-router";
import { useCreateChannel } from "../api/use-create-channel";
import { DialogDescription } from "@radix-ui/react-dialog";

export const CreateChannelModal = () => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { open, setOpen } = useCreteChannelModal();
  const [name, setName] = useState("");
  const { createChannel, isPending } = useCreateChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createChannel({ name, workspaceId })
      .then((result) => {
        handleClose();
        toast.success("Channel created");
        navigate({ to: "/workspaces/$workspaceId/channels/$channelId", params: { workspaceId, channelId: result.id } });
      })
      .catch(() => {
        toast.error("Unable to create channel");
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
