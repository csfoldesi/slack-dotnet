import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface ConversationHeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const ConversationHeader = ({ memberName, memberImage, onClick }: ConversationHeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm" onClick={onClick}>
        <Avatar variant="small" image={memberImage} fallback={memberName} />
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
