import { AuthScreen } from "@/features/auth/components/auth-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: AuthScreen,
});
