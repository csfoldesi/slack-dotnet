import { useChannelId } from "@/hooks/user-channel-id";
import { useWorkspaceId } from "@/hooks/user-workspace-id";
import { useGetWorkspace } from "../api/use-get-workspace";
import { useMemo } from "react";
import { useGetMembers } from "../api/use-get-members";
import { Loader } from "@/components/loader";
import { useGetMembership } from "../api/use-get-membership";
import { AlertTriangle, HashIcon, MessageSquareTextIcon, SendHorizonalIcon } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useCreteChannelModal } from "../store";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
  const memberId = "memberid";
  const workspaceId = useWorkspaceId();
  const activeChannelId = useChannelId();
  const { data: membership, isLoading: membershipLoading } = useGetMembership(workspaceId);
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace(workspaceId);
  const { data: members } = useGetMembers(workspaceId);

  const { setOpen } = useCreteChannelModal();

  const channels = useMemo(() => workspace?.channels, [workspace]);

  if (workspaceLoading || membershipLoading) {
    return <Loader />;
  }

  if (!workspace || !membership) {
    return (
      <div className="flex felx-col bg-[#5e2c5f] h-full items-center justify-center gap-y-2">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={membership.role === "admin"} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareTextIcon} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonalIcon} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={membership.role === "admin" ? () => setOpen(true) : undefined}>
        {channels?.map((item) => (
          <SidebarItem
            label={item.name}
            icon={HashIcon}
            id={item.id}
            key={item.id}
            variant={item.id === activeChannelId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct messages" hint="New DM" onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item.userId}
            id={item.userId}
            label={item.name}
            image={item.avatar}
            variant={item.userId === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
