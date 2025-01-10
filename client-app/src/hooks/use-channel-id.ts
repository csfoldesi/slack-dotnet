import { useParams } from "@tanstack/react-router";

export const useChannelId = () => {
  const channelId = useParams({ strict: false, select: (params) => params.channelId });

  return channelId !== undefined ? channelId : "";
};
