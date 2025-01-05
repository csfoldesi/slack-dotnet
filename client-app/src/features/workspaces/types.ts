import { Channel } from "../channels/types";

export type Workspace = {
  id: string;
  name: string;
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
