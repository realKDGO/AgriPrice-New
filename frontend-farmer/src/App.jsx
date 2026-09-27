import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./hooks/useApp";
import AppRoutes from "./routes/AppRoutes";
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
