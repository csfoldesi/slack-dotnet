import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
//import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuthStore } from "@/features/auth/store";

interface RouterContext {
  auth: ReturnType<typeof useAuthStore>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
