import { useMutation } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { SignInRequest, User } from "../types";
import { useAuthStore } from "../store";

export const useSignIn = () => {
  const authStore = useAuthStore();

  const mutation = useMutation<User, AxiosError, SignInRequest>({
    mutationFn: (data: SignInRequest) => client.post("/auth/signin", data).then((res) => res.data.data),
    onSuccess: (result: User) => {
      authStore.setUser(result);
    },
  });

  return { signIn: mutation.mutateAsync, isPending: mutation.isPending };
};
