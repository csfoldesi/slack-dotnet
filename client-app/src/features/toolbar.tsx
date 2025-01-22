import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { useGetWorkspace } from "./workspaces/api/use-get-workspace";
import { Loader } from "@/components/loader";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "./channels/api/use-get-channels";
import { useGetMembers } from "./workspaces/api/use-get-members";
import { useNavigate } from "@tanstack/react-router";

export const Toolbar = () => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace(workspaceId);
  const { data: channels } = useGetChannels(workspaceId);
  const { data: members } = useGetMembers(workspaceId);

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    navigate({ to: "/workspaces/$workspaceId/channels/$channelId", params: { workspaceId, channelId } });
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    navigate({ to: "/workspaces/$workspaceId/members/$memberId", params: { workspaceId, memberId } });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <nav className="bg-[#481349] flex  items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workspace?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem key={channel.id} onSelect={() => onChannelClick(channel.id)}>
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem key={member.userId} onSelect={() => onMemberClick(member.userId)}>
                  {member.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="icon">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
