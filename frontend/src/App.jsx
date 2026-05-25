/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: App.jsx
    Description: Root component that manages page navigation using state.
    Renders the correct page based on the active tab, and persists the
    last visited page in localStorage.
*/
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import TabBar from "./components/TabBar";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import MapPage from "./pages/MapPage";
import { useTheme } from "./context/ThemeContext";

const PAGES = ["booking", "admin", "dashboard", "map"];

export default function App() {
  const { theme } = useTheme();

  // Restore last visited page from localStorage on first load
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem("cabsonline_page") || "booking"
  );

  // Save active page whenever it changes
  useEffect(() => {
    localStorage.setItem("cabsonline_page", activePage);
  }, [activePage]);

  // Apply the current theme as a data attribute on <html> for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case "admin":
        return <AdminPage />;
      case "dashboard":
        return <DashboardPage />;
      case "map":
        return <MapPage />;
      default:
        return <BookingPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={activePage} onNavigate={setActivePage} pages={PAGES} />
      <MobileHeader />
      <main className="main-content">{renderPage()}</main>
      <TabBar active={activePage} onNavigate={setActivePage} pages={PAGES} />
    </div>
  );
}
