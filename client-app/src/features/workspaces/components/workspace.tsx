import { useNavigate, useParams } from "@tanstack/react-router";
import { useGetWorkspace } from "../api/use-get-workspace";
import { Loader } from "@/components/loader";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export const Workspace = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams({ strict: false });
  const { data: workspace, isLoading } = useGetWorkspace(workspaceId!);

  useEffect(() => {
    if (isLoading || !workspaceId || !workspace || workspace.channels.length == 0) return;

    const channelId = workspace.channels[0].id;
    navigate({ to: "/workspaces/$workspaceId/channels/$channelId", params: { workspaceId, channelId } });
  }, [isLoading, navigate, workspace, workspaceId]);

  if (isLoading) {
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
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>;
  }

  return (
    <>
      <div>Workspace</div>
      <div>{workspaceId}</div>
      <div>{JSON.stringify(workspace)}</div>
    </>
  );
};
