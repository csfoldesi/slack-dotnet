import { useMutation } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";
import { SignUpRequest, User } from "../types";
import { useAuthStore } from "../store";

export const useSignUp = () => {
  const authStore = useAuthStore();

  const mutation = useMutation<User, AxiosError, SignUpRequest>({
    mutationFn: (data: SignUpRequest) => client.post("/auth/signup", data).then((res) => res.data.data),
    onSuccess: (result: User) => {
      authStore.setUser(result);
    },
  });

  return { signUp: mutation.mutateAsync, isPending: mutation.isPending };
};
