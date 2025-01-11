import { useNavigate, useParams } from "@tanstack/react-router";
import { useGetWorkspace } from "../api/use-get-workspace";
import { Loader } from "@/components/loader";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { useCreteChannelModal } from "../store";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";

export const Workspace = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ strict: false });
  const { data: workspace, isSuccess } = useGetWorkspace(workspaceId!);
  const { setOpen } = useCreteChannelModal();

  useEffect(() => {
    if (!isSuccess || !workspaceId || !workspace) return;
    if (workspace.channels.length === 0) {
      setOpen(true);
      return;
    }
    const channelId = workspace.channels[0].id;
    navigate({ to: "/workspaces/$workspaceId/channels/$channelId", params: { workspaceId, channelId } });
  }, [isSuccess, navigate, setOpen, workspace, workspaceId]);

  if (!isSuccess) {
    return <Loader />;
  }

  if (!workspace) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Workspace not found</span>
      </div>
    );
  }

  if (workspace.channels.length == 0) {
    return (
      <>
        <CreateChannelModal />
        <div className="h-full flex items-center justify-center flex-col gap-2">
          <TriangleAlert className="size-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">No channel found</span>
        </div>
        ;
      </>
    );
  }

  return (
    <>
      <div>Workspace</div>
      <div>{workspaceId}</div>
      <div>{JSON.stringify(workspace)}</div>
    </>
  );
};
