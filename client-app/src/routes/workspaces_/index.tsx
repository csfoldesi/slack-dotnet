import { Workspaces } from "@/features/workspaces/components/workspaces";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/")({
  component: Workspaces,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
});
