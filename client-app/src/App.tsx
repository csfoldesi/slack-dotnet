import { createRouter, parseSearchWith, RouterProvider, stringifySearchWith } from "@tanstack/react-router";
import "./App.css";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "./features/auth/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a new router instance
const router = createRouter({
  routeTree,
  parseSearch: parseSearchWith(JSON.parse),
  stringifySearch: stringifySearchWith(JSON.stringify),
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function App() {
  const auth = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} context={{ auth }} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
