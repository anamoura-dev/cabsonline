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
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem("cabsonline_page") || "booking"
  );

  useEffect(() => {
    localStorage.setItem("cabsonline_page", activePage);
  }, [activePage]);

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
