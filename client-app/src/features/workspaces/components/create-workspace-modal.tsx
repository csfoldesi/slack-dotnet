import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useCreteWorkspaceModal } from "../store";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useNavigate } from "@tanstack/react-router";

export const CreateWorkspaceModal = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { open, setOpen } = useCreteWorkspaceModal();
  const { mutateAsync, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateAsync(name)
      .then((result) => {
        toast.success("Workspace created");
        navigate({ to: "/workspaces/$workspaceId", params: { workspaceId: result.id } });
        handleClose();
      })
      .catch(() => {
        toast.error("Unable to create wokrspace");
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
