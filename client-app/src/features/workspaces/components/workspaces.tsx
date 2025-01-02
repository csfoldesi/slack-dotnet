import { useNavigate } from "@tanstack/react-router";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useEffect } from "react";

export const Workspaces = () => {
  const navigate = useNavigate();
  const { data: workspaces, status } = useGetWorkspaces();

  useEffect(() => {
    if (workspaces !== undefined && workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      navigate({ to: "/workspaces/$workspaceId", params: { workspaceId } });
    }
  }, [navigate, workspaces]);

  if (status !== "success") {
    return <>Loading</>;
  }
  return <div>No workspace found</div>;
};
