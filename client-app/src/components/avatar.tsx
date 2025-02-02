import { cva, VariantProps } from "class-variance-authority";
import { AvatarFallback, AvatarImage, Avatar as AvatarBase } from "./ui/avatar";
import { cn } from "@/lib/utils";

const avatarVariants = cva("", {
  variants: {
    variant: {
      default: "",
      xs: "size-5 rounded-sm mr-1",
      small: "size-6 mr-2 rounded-sm",
      medium: "size-14 mr-2",
      profile: "max-w-[256px] max-h-[256px] size-full",
      userButton: "size-10 hover:opacity-75 transition rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const fallbackVariants = cva("", {
  variants: {
    variant: {
      default: "",
      xs: "rounded-sm bg-sky-500 text-white text-xs",
      small: "",
      medium: "text-2xl",
      profile: "aspect-square text-6xl",
      userButton: "bg-blue-400 text-white rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants>, VariantProps<typeof fallbackVariants> {
  image?: string;
  fallback?: string;
}

export const Avatar = ({ image, fallback, variant: variant }: AvatarProps) => {
  const avatarFallback = fallback?.charAt(0).toUpperCase();

  return (
    <AvatarBase className={cn(avatarVariants({ variant: variant }))}>
      <AvatarImage src={image} />
      <AvatarFallback className={cn(fallbackVariants({ variant: variant }))}>{avatarFallback}</AvatarFallback>
    </AvatarBase>
  );
};
