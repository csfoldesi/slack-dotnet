import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { ChevronDownIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetMembership } from "../../workspaces/api/use-get-membership";
import { useUpdateChannel } from "../api/use-update-channel";
import { useDeleteChannel } from "../api/use-delete-channel";
import { useNavigate } from "@tanstack/react-router";

interface HeaderProps {
  title: string;
}

export const ChannelHeader = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible."
  );
  const [channemName, setChannelName] = useState(title);
  const [editOpen, setEditOpen] = useState(false);
  const { data: membership } = useGetMembership(workspaceId);
  const { updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
  //const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();
  const { deleteChannel, isPending: isDeletingChannel } = useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (membership?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setChannelName(value);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel({ id: channelId, name: channemName })
      .then(() => {
        toast.success("Channel updated");
        setEditOpen(false);
      })
      .catch(() => {
        toast.error("Failed to update channel");
      });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteChannel({ workspaceId, channelId })
      .then(() => {
        toast.success("Channel deleted");
        setEditOpen(false);
        navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
      })
      .catch(() => {
        toast.error("Failed to delete channel");
      });
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
            <span className="truncate"># {title}</span>
            <ChevronDownIcon className="size-4 ml-1 shrink-0" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {membership?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdate}>
                  <Input
                    value={channemName}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {membership?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={isDeletingChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
