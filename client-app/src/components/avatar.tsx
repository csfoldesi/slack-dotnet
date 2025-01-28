import { cva, VariantProps } from "class-variance-authority";
import { AvatarFallback, AvatarImage, Avatar as AvatarBase } from "./ui/avatar";
import { cn } from "@/lib/utils";

const avatarVariants = cva("", {
  variants: {
    variant: {
      default: "",
      xs: "size-5 rounded-md mr-1",
      small: "size-6 shrink-0",
      medium: "size-14 mr-2",
      xl: "max-w-[256px] max-h-[256px] size-full",
      userButton: "size-10 hover:opacity-75 transition rounded-md",
    },
    textVariant: {
      default: "",
      xl: "aspect-square text-6xl",
      userButton: "bg-blue-400 text-white rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
    textVariant: "default",
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  image?: string;
  fallback?: string;
  className?: string;
}

export const Avatar = ({ image, fallback, className, variant, textVariant: textSize }: AvatarProps) => {
  const avatarFallback = fallback?.charAt(0).toUpperCase();

  return (
    <AvatarBase className={cn(avatarVariants({ variant, className }))}>
      <AvatarImage src={image} />
      <AvatarFallback className={cn(avatarVariants({ textVariant: textSize }))}>{avatarFallback}</AvatarFallback>
    </AvatarBase>
  );
};
