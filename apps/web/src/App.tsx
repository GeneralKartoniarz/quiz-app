import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile/Profile";
import DeckCreate from "./pages/Deck/Create/DeckCreate";

import { Layout } from "./components/Layout/Layout";
import { ThemeProvider } from "./context/ThemeProvider";

import "./index.css";
import "animate.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/Profile"
              element={<Navigate to="/profile" replace />}
            />

            {/* Trasy nawigacji (obecnie fallback do strony głównej) */}
            <Route path="/Deck/Create" element={<DeckCreate />} />
            <Route path="/areny" element={<Navigate to="/" replace />} />
            <Route path="/stworz" element={<Navigate to="/" replace />} />

            {/* Domyślne przekierowanie dla nieznanych tras */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
