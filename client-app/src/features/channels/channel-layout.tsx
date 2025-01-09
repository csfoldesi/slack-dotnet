import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "./api/use-get-channel";
import { Loader } from "@/components/loader";
import { TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./channel-header";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNavigate } from "@tanstack/react-router";

export const ChannelLayout = () => {
  const navigate = useNavigate();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: channel, isLoading: isChannelLoading, error } = useGetChannel(channelId);
  //const { results, status, loadMore } = useGetMessages({ channelId });

  //const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (isChannelLoading /*|| status === "LoadingFirstPage"*/) {
    return <Loader />;
  }

  if (error?.status === 404 || !channel) {
    //navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
    //return null;
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader title={channel.name} />
      <div>MessageList</div>
      <div>CHatInput</div>
    </div>
  );
};
