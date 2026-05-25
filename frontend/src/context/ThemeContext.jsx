/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: ThemeContext.jsx
    Description: Provides light/dark theme state across the app. Persists the
    user's preference in localStorage and applies it as a data-theme attribute on <html>.
*/
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Read saved preference on first load, defaulting to dark
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cabsonline_theme") || "dark"
  );

  // Persist and apply theme whenever it changes
  useEffect(() => {
    localStorage.setItem("cabsonline_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
