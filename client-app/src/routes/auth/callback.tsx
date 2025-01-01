import { useGetUser } from "@/features/auth/api/use-get-user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useEffect } from "react";

/*type CallbackParams = {
  accessToken?: string;
  refreshToken?: string;
};*/

export const Route = createFileRoute("/auth/callback")({
  /*validateSearch: (search: Record<string, unknown>): CallbackParams => {
    return {
      accessToken: search.accessToken as string,
      refreshToken: search.refreshToken as string,
    };
  },*/
  component: RouteComponent,
});

function RouteComponent() {
  //const { accessToken, refreshToken } = Route.useSearch();
  const navigate = useNavigate();
  const { data: userProfile } = useGetUser();

  useEffect(() => {
    if (userProfile !== undefined) {
      navigate({ to: "/workspace" });
    }
  }, [navigate, userProfile]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
