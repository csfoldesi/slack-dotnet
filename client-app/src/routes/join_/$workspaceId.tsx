import JoinPage from "@/features/join/join-page";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/join_/$workspaceId")({
  component: JoinPage,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
});
