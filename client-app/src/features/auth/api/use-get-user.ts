import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { AxiosError } from "axios";
import { client } from "@/client";
import { useAuthStore } from "../store";

type Response = User;

export const useGetUser = () => {
  const { setUser } = useAuthStore();

  return useQuery<Response, AxiosError>({
    queryKey: ["GetUserProfile"],
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      client.get(`/auth`).then((res) => {
        setUser(res.data.data);
        return res.data.data;
      }),
  });
};