import { Channel } from "../channels/types";

export type Workspace = {
  id: string;
  name: string;
  isMember: boolean;
  joinCode: string;
  channels: Channel[];
};

export type Member = {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

export type GetMembershipRequets = {
  workspaceId: string;
  userId?: string;
};
