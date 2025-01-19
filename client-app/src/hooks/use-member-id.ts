import { useParams } from "@tanstack/react-router";

export const useMemberId = () => {
  const memberId = useParams({ strict: false, select: (params) => params.memberId });

  return memberId !== undefined ? memberId : "";
};
