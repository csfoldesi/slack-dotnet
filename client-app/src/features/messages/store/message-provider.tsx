import { Message } from "../types";
import { MessageContext } from "./message-context";

export const MessageProvider = ({ children, message }: { children: React.ReactNode; message: Message }) => {
  return <MessageContext.Provider value={message}>{children}</MessageContext.Provider>;
};
