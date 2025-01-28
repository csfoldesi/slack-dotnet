import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store";
import { useNavigate } from "@tanstack/react-router";
import { useSignOut } from "../api/use-sign-out";
import { Avatar } from "@/components/avatar";

export const UserButton = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { signOut } = useSignOut();

  const onSignOut = async () => {
    signOut().then(() => {
      navigate({ to: "/auth" });
    });
  };

  //if (isLoading) return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (!user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar variant="userButton" textVariant="userButton" image={user.avatar} fallback={user.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem className="flex items-center h-10 cursor-pointer" onClick={() => onSignOut()}>
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
