import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../../components/Hero/Hero";
import { QuizGrid, type QuizItem } from "../../components/QuizGrid/QuizGrid";
import { GameModes } from "../../components/GameModes/GameModes";
import type { LayoutContextType } from "../../components/Layout/Layout";

// Przykładowe dane quizów do przetestowania widoku
const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: 1,
    title: "Historia Starożytna Rzymu",
    questionsCount: 15,
    tags: ["Historia", "Rzym", "Antyk"],
    author: "Jan Kowalski",
  },
  {
    id: 2,
    title: "Podstawy JavaScript & React",
    questionsCount: 20,
    tags: ["IT", "JavaScript", "React"],
    author: "Aleksandra S.",
  },
  {
    id: 3,
    title: "Flagi Świata i Stolice",
    questionsCount: 30,
    tags: ["Geografia", "Świat"],
    author: "Michał W.",
  },
  {
    id: 4,
    title: "Kultowe Filmy XXI Wieku",
    questionsCount: 12,
    tags: ["Film", "Popkultura"],
    author: "Ania K.",
  },
  {
    id: 5,
    title: "Biologia: Komórka i DNA",
    questionsCount: 18,
    tags: ["Biologia", "Nauka"],
    author: "Piotr R.",
  },
  {
    id: 6,
    title: "Matematyka – Logika i Zbiory",
    questionsCount: 10,
    tags: ["Matematyka", "Logika"],
    author: "Tomasz B.",
  },
  {
    id: 7,
    title: "Architektura Komputerów & x86",
    questionsCount: 25,
    tags: ["IT", "Asembler", "Hardware"],
    author: "Kamil M.",
  },
  {
    id: 8,
    title: "Klasyka Muzyki Rockowej",
    questionsCount: 15,
    tags: ["Muzyka", "Rock"],
    author: "Marta D.",
  },
];

export const HomePage = () => {
  const layoutContext = useOutletContext<LayoutContextType | undefined>();
  const [localSearchQuery] = useState("");
  const searchQuery = layoutContext?.searchQuery ?? localSearchQuery;
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'title' | 'questions'

  // Filtrowanie i sortowanie listy quizów w zależności od stanu
  const filteredQuizzes = useMemo(() => {
    return INITIAL_QUIZZES.filter((quiz) => {
      const query = searchQuery.toLowerCase();
      return (
        quiz.title.toLowerCase().includes(query) ||
        quiz.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        quiz.author.toLowerCase().includes(query)
      );
    }).sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "questions") return b.questionsCount - a.questionsCount;
      return a.id - b.id; // Domyślnie wg id / popularności
    });
  }, [searchQuery, sortBy]);

  const handleJoinArena = (pin: string) => {
    if (pin.length < 6) {
      alert("Wprowadź pełny 6-cyfrowy kod PIN!");
      return;
    }
    alert(`Dołączanie do areny z kodem: ${pin}`);
    // Tutaj nawigacja do pokoju gry, np.: navigate(`/arena/${pin}`)
  };

  return (
    <>
      <Hero onJoinArena={handleJoinArena} />
      <GameModes />
      <QuizGrid
        quizList={filteredQuizzes}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </>
  );
};

export default HomePage;
