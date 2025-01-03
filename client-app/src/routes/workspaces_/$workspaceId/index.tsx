import { Workspace } from "@/features/workspaces/components/workspace";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/$workspaceId/")({
  component: Workspace,
});
