import { Button } from "@/components/ui/button";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/avatar";

const userItemVariants = cva("flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden", {
  variants: {
    variant: {
      default: "text-[#f9edffcc]",
      active: "text-[#481349] bg-white/90 hover:bg-white/90",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

interface UserItemProps {
  id: string;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button variant="transparent" className={cn(userItemVariants({ variant: variant }))} size="sm" asChild>
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        <Avatar variant="xs" image={image} fallback={label} />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
