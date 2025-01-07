import { Store, useStore } from "@tanstack/react-store";
import { User } from "./types";

const key = "tanstack.auth.user";

interface AuthState {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  user: localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

const AuthStore = new Store<AuthState>(initialState);

export const useAuthStore = () => {
  const store = useStore(AuthStore);

  const setUser = (user: User | null) => {
    if (user) {
      AuthStore.setState((state) => ({ ...state, user }));
      localStorage.setItem(key, JSON.stringify(user));
    } else {
      AuthStore.setState((state) => ({ ...state, user: undefined }));
      localStorage.removeItem(key);
    }
  };

  const isAuthenticated = store.user !== undefined;

  return { user: store.user, setUser, isAuthenticated };
};
