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

/*export function sleep(ms = 1000): Promise<void> {
  console.log("Kindly remember to remove `sleep`");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

client.interceptors.response.use(async (response) => {
  // add artificial delay for dev env
  if (import.meta.env.DEV) {
    await sleep();
  }
  return response.data;
});*/
