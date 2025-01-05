import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/user-workspace-id";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible.");
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const { mutateAsync: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutateAsync: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace({ id: workspaceId, name: value })
      .then(() => {
        toast.success("Workspace updated");
        setEditOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update workspace");
      });
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteWorkspace(workspaceId)
      .then(() => {
        toast.success("Workspace deleted");
        navigate({ to: "/" });
      })
      .catch(() => {
        toast.error("Failed to delete workspace");
      });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isDeletingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600">
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
