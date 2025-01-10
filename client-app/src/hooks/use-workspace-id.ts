import { useParams } from "@tanstack/react-router";

export const useWorkspaceId = () => {
  const workspaceId = useParams({ strict: false, select: (params) => params.workspaceId });

  return workspaceId !== undefined ? workspaceId : "";
};
