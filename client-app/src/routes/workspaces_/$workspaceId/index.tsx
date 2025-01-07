import { Workspace } from "@/features/workspaces/components/workspace";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/$workspaceId/")({
  component: Workspace,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
});
