import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useCreteWorkspaceModal } from "./workspaces/store";
import { useNavigate } from "@tanstack/react-router";
import { useGetWorkspaces } from "./workspaces/api/use-get-workspaces";
import { useGetWorkspace } from "./workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/user-workspace-id";

export const WorkspaceSwitcher = () => {
  const navigate = useNavigate();

  const workspaceId = useWorkspaceId();

  const { setOpen } = useCreteWorkspaceModal();

  const { data: workspaces, isLoading: workspaceLoading } = useGetWorkspaces();
  const { data: currentWokrspace } = useGetWorkspace(workspaceId);

  const filteredWorkspaces = workspaces?.filter((w) => w.id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ababab] hover:bg-[#ababab]/80 text-slate-100 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            currentWokrspace?.name.charAt(0).toLocaleUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => {
            navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
          }}
          className="cursor-pointer flex-col justify-start items-start capitalize font-semibold">
          {currentWokrspace?.name}
          <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => {
              navigate({ to: "/workspaces/$workspaceId", params: { workspaceId: workspace.id } });
            }}
            className="cursor-pointer capitalize overflow-hidden">
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
