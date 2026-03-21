import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/toast";
import { AppProvider } from "./components/context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}