import { Store } from "@tanstack/react-store";

type StoreValues = {
  dogs: number;
  cats: number;
};

export const store = new Store<StoreValues>({
  dogs: 0,
  cats: 0,
});
