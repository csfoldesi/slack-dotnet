import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

createAuthRefreshInterceptor(
  client,
  async () => {
    try {
      await client.get("/auth/refresh-token");
      return Promise.resolve;
    } catch {
      return Promise.reject;
    }
  },
  {
    statusCodes: [401],
    pauseInstanceWhileRefreshing: true,
  }
);
