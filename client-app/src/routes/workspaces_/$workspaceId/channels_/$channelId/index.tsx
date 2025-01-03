import { Layout } from "@/features/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/$workspaceId/channels_/$channelId/")({
  component: Layout,
});
