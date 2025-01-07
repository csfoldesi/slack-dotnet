import { Layout } from "@/features/layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/$workspaceId/channels_/$channelId/")({
  component: Layout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
});
