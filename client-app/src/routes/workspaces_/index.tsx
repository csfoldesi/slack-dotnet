import { isAuthenticated } from "@/features/auth/store";
import { Workspaces } from "@/features/workspaces/components/workspaces";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces_/")({
  component: Workspaces,
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/auth" });
    }
  },
});