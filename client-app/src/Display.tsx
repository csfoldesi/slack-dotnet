import { useStore } from "@tanstack/react-store";
import { store } from "./store";

interface DisplayProps {
  animal: "cats" | "dogs";
}

export const Display = ({ animal }: DisplayProps) => {
  const count = useStore(store, (state) => state[animal]);
  return <div>{`${animal}: ${count}`}</div>;
};
