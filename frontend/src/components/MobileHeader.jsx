/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: MobileHeader.jsx
    Description: Fixed top header shown on mobile screens. Displays the app
    brand name and a button to toggle between light and dark themes.
*/
import { useTheme } from "../context/ThemeContext";
import { CarIcon, SunIcon, MoonIcon } from "./Icons";

export default function MobileHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="mobile-header">
      <div className="mobile-brand">
        <div className="brand-logo brand-logo-sm">
          <CarIcon width={16} height={16} stroke="#fff" />
        </div>
        <h2>CabsOnline</h2>
      </div>
      <button className="theme-toggle-mini" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
      </button>
    </header>
  );
}
