import { useMutation } from "@tanstack/react-query";
import { client } from "@/client";
import { useAuthStore } from "../store";

export const useSignOut = () => {
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => client.get("/auth/signout").then((res) => res.data),
    onSuccess: () => {
      setUser(null);
    },
  });

  return { signOut: mutation.mutateAsync, isPending: mutation.isPending };
};
