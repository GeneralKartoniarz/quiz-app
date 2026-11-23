import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile/Profile";
import DeckCreate from "./pages/Deck/Create/DeckCreate";
import FlashcardsMain from "./pages/Deck/FlashcardsMain/Flashcardsmain";
import { FlashcardsLearn } from "./pages/Deck/FlashcardsLearn/FlashcardsLearn";

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

            {/* Trasy nawigacji */}
            <Route path="/fiszki" element={<FlashcardsMain />} />
            <Route path="/Deck/Create" element={<DeckCreate />} />
            <Route path="/stworz" element={<DeckCreate />} />
            <Route path="/areny" element={<Navigate to="/" replace />} />
            <Route path="/quizy" element={<Navigate to="/" replace />} />
            <Route path="/Deck/FlashcardsLearn" element={<FlashcardsLearn />} />
            <Route path="/Deck/FlashcardsLearn/:id" element={<FlashcardsLearn />} />
            <Route path="/fiszki/:id/learn" element={<FlashcardsLearn />} />

            {/* Domyślne przekierowanie dla nieznanych tras */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
