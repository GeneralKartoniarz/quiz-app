import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import styles from "./Layout.module.css";

export interface LayoutContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.pageWrapper}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className={styles.mainContent}>
        <Outlet context={{ searchQuery, setSearchQuery } satisfies LayoutContextType} />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

