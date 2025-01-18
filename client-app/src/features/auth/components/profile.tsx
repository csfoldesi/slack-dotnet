import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMembership } from "@/features/workspaces/api/use-get-membership";
import { useUpdateMembership } from "@/features/workspaces/api/use-update-membership";
import { useDeleteMembership } from "@/features/workspaces/api/use-delete-membership";
import { useNavigate } from "@tanstack/react-router";

interface ProfileProps {
  userId: string;
  onClose: () => void;
}

export const Profile = ({ userId, onClose }: ProfileProps) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } = useGetMembership({ workspaceId });
  const { data: member, isLoading: isLoadingMember } = useGetMembership({ workspaceId, userId });
  const { updateMembership } = useUpdateMembership();
  const { deleteMembership, isPending: isDeletingMemebrship } = useDeleteMembership();

  const [LeaveDialog, confirmLeave] = useConfirm("Leave workspace", "Are you sure you want to leave this workspace?");
  const [RemoveDialog, confirmRemove] = useConfirm("Remove user", "Are you sure you want to remove this member?");
  const [UpdateDialog, confirmUpdate] = useConfirm("Change role", "Are you sure you want to this this member's role?");

  const avatarFallback = member?.name[0] ?? "M";

  const onRemove = async () => {
    if (!(await confirmRemove())) return;

    deleteMembership({ workspaceId, userId })
      .then(() => {
        toast.success("Member removed");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to remove member");
      });
  };

  const onLeave = async () => {
    if (!(await confirmLeave())) return;
    deleteMembership({ workspaceId, userId })
      .then(() => {
        navigate({ to: "/" });
        toast.success("You left the workspace");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to leave the workspace");
      });
  };

  const onUpdateRole = async (role: "admin" | "member") => {
    if (!(await confirmUpdate())) return;

    updateMembership({ workspaceId, userId, role })
      .then(() => {
        toast.success("Role changed");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to change role");
      });
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex justify-between items-center h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
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

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex justify-between items-center h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangleIcon className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className="flex h-full flex-col">
        <div className="flex justify-between items-center h-[49px] border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.avatar} />
            <AvatarFallback className="aspect-square text-6xl">{avatarFallback}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.name}</p>
          {currentMember?.role === "admin" && currentMember.userId !== userId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) => {
                      onUpdateRole(role as "admin" | "member");
                    }}>
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="w-full" onClick={onRemove} disabled={isDeletingMemebrship}>
                Remove
              </Button>
            </div>
          ) : currentMember?.userId === userId && currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={onLeave} disabled={isDeletingMemebrship}>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
              <a href={`mailto:${member.email}`} className="text-sm  hover:underline text-[#1264a3]">
                {member.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
