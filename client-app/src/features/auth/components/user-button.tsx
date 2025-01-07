import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const avatarFallback = user.name.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition rounded-md">
          <AvatarImage alt={user.name} src={user.avatar} />
          <AvatarFallback className="bg-blue-400 text-white rounded-md">{avatarFallback}</AvatarFallback>
        </Avatar>
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
