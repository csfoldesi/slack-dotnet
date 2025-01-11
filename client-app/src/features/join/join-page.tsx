import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetWorkspace } from "../workspaces/api/use-get-workspace";
import { Loader } from "@/components/loader";
import { useJoinWorkspace } from "./api/use-join-wokrspace";

const JoinPage = () => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { joinWorkspace, isPending } = useJoinWorkspace();
  const [joinCode, setJoinCode] = useState("");
  const { data: workspace, isLoading } = useGetWorkspace(workspaceId);

  useEffect(() => {
    if (workspace?.isMember) {
      navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
    }
  }, [navigate, workspace?.isMember, workspaceId]);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinWorkspace({ workspaceId, code: joinCode })
      .then(() => {
        toast.success("Workspace joined");
        navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
      })
      .catch(() => {
        toast.error("Failed to join workspace");
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <img src="/logo.svg" alt="Logo" width={60} height={60} />
      <div className="flex felx-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl">
            Join to <span className="font-bold">{workspace?.name}</span>
          </h1>
          <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
        </div>
      </div>
      <form onSubmit={handleJoin} className="space-y-4 flex flex-col items-center">
        <Input
          value={joinCode}
          disabled={isPending}
          onChange={(e) => setJoinCode(e.target.value)}
          required
          autoFocus
          minLength={6}
          maxLength={6}
          size={6}
          placeholder="code"
        />
        <Button disabled={isPending}>Join</Button>
      </form>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
