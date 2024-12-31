import "./App.css";
import { Button } from "./components/ui/button";
import { Display } from "./Display";
import { AuthScreen } from "./features/auth/components/auth-screen";
import { UserButton } from "./features/auth/components/user-button";
import { store } from "./store";

function App() {
  const updateState = (animal: "cats" | "dogs") => {
    store.setState((state) => {
      return {
        ...state,
        [animal]: state[animal] + 1,
      };
    });
  };

  interface IncrementProps {
    animal: "cats" | "dogs";
  }

  const Increment = ({ animal }: IncrementProps) => (
    <Button onClick={() => updateState(animal)}>My Friend Likes {animal}</Button>
  );

  return (
    <div className="h-full w-full">
      <AuthScreen />
    </div>
  );

  /*return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1>How many of your friends like cats or dogs?</h1>
      <p>Press one of the buttons to add a counter of how many of your friends like cats or dogs</p>
      <Increment animal="dogs" />
      <Display animal="dogs" />
      <Increment animal="cats" />
      <Display animal="cats" />
      <UserButton />
    </div>
  );*/
}

export default App;
