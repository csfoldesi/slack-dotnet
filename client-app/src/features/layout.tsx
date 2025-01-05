import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Loader } from "@/components/loader";
import { WorkspaceSidebar } from "./workspaces/components/workspace-sidebar";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { Modals } from "@/components/modals";

export const Layout = () => {
  const showPanel = true;
  const parentMessageId = undefined;
  const profileMemberId = undefined;

  return (
    <>
      <div className="h-full">
        <Toolbar />
        <div className="flex h-[calc(100vh-40px)]">
          <Sidebar />
          <ResizablePanelGroup direction="horizontal" autoSaveId="ca-worspace-layout">
            <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5e2c5f]">
              <WorkspaceSidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={20}>
              <div>Children</div>
            </ResizablePanel>
            {showPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={20} defaultSize={29}>
                  {parentMessageId ? <div>Thread</div> : profileMemberId ? <div>Profile</div> : <Loader />}
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