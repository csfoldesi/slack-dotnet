import { Store } from "@tanstack/react-store";
import { User } from "./types";

export interface AuthState {
  user?: User;
}

const initialState = {
  user: undefined,
};

export const AuthStore = new Store<AuthState>(initialState);
