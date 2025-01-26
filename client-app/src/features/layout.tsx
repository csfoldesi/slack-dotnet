import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Loader } from "@/components/loader";
import { WorkspaceSidebar } from "./workspaces/components/workspace-sidebar";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { Modals } from "@/components/modals";
import { ChannelLayout } from "./channels/channel-layout";
import { usePanel } from "@/hooks/use-panel";
import { Profile } from "./auth/components/profile";
import { Thread } from "./messages/components/thread";
import { useMemberId } from "@/hooks/use-member-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { ConversationPage } from "./conversations/components/conversation-page";

export const Layout = () => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();
  const showPanel = !!parentMessageId || !!profileMemberId;
  const channelId = useChannelId();
  const memberId = useMemberId();

  return (
    <>
      <div className="h-full">
        <Toolbar />
        <div className="flex h-[calc(100vh-40px)]">
          <Sidebar />
          <ResizablePanelGroup direction="horizontal" autoSaveId="ca-worspace-layout">
            <ResizablePanel defaultSize={20} minSize={11} id="WorkspaceSidebar" order={1} className="bg-[#5e2c5f]">
              <WorkspaceSidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={20} id="Messages" order={2}>
              {channelId ? <ChannelLayout /> : memberId ? <ConversationPage /> : null}
            </ResizablePanel>
            {showPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={20} defaultSize={29} id="ThreadProfile" order={3}>
                  {parentMessageId ? (
                    <Thread messageId={parentMessageId} onClose={onClose} />
                  ) : profileMemberId ? (
                    <Profile userId={profileMemberId} onClose={onClose} />
                  ) : (
                    <Loader />
                  )}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
      <Modals />
    </>
  );
};
