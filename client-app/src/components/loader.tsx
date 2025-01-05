import { Loader as LucideLoader } from "lucide-react";

export const Loader = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2">
      <LucideLoader className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
};
