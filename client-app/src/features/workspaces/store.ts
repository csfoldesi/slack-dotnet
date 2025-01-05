import { Store, useStore } from "@tanstack/react-store";

const CreteWorkspaceModalStore = new Store<boolean>(false);

export const useCreteWorkspaceModal = () => {
  const store = useStore(CreteWorkspaceModalStore);

  const setOpen = (value: boolean) => {
    CreteWorkspaceModalStore.setState(() => value);
  };

  return { open: store, setOpen };
};

const CreteChannelModalStore = new Store<boolean>(false);

export const useCreteChannelModal = () => {
  const store = useStore(CreteChannelModalStore);

  const setOpen = (value: boolean) => {
    CreteChannelModalStore.setState(() => value);
  };

  return { open: store, setOpen };
};
