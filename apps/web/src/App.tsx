import HomePage from "./pages/HomePage/HomePage";
import { ThemeProvider } from "./context/ThemeProvider";
import "./index.css";
import "animate.css";

function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
