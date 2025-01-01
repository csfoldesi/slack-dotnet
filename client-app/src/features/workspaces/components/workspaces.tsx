import { useGetUser } from "@/features/auth/api/use-get-user";
import { useAuthStore } from "@/features/auth/store";
//import { useStore } from "@tanstack/react-store";

export const Workspaces = () => {
  //const user = useStore(AuthStore, (state) => state.user);
  const { user } = useAuthStore();

  const { data: userProfile } = useGetUser();

  console.log(userProfile);

  return (
    <>
      <div>Workspaces</div>
      <div>{JSON.stringify(user)}</div>
    </>
  );
};
