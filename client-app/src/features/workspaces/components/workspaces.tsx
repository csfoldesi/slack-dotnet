import { useNavigate } from "@tanstack/react-router";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useEffect } from "react";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { useCreteWorkspaceModal } from "../store";

export const Workspaces = () => {
  const navigate = useNavigate();
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const { open, setOpen } = useCreteWorkspaceModal();

  useEffect(() => {
    if (isLoading) return;
    if (workspaces !== undefined && workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, navigate, open, setOpen, workspaces]);

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
