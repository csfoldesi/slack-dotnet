import { useNavigate } from "@tanstack/react-router";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useEffect } from "react";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { useCreteWorkspaceModal } from "../store";

export const Workspaces = () => {
  const navigate = useNavigate();
  const { data: workspaces, isLoading, isFetchedAfterMount } = useGetWorkspaces();
  const { open, setOpen } = useCreteWorkspaceModal();

  useEffect(() => {
    if (isLoading || !isFetchedAfterMount) return;
    if (workspaces !== undefined && workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
    } else if (!open) {
      setOpen(true);
    }
  }, [isFetchedAfterMount, isLoading, navigate, open, setOpen, workspaces]);

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
