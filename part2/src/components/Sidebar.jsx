import { useTheme } from "../context/ThemeContext";
import { CarIcon, ClipboardIcon, ChartIcon, MapPinIcon, SunIcon, MoonIcon } from "./Icons";

const NAV_ITEMS = {
  booking: { icon: CarIcon, label: "Book a Taxi" },
  admin: { icon: ClipboardIcon, label: "Admin Panel" },
  dashboard: { icon: ChartIcon, label: "Dashboard" },
  map: { icon: MapPinIcon, label: "Map View" },
};

export default function Sidebar({ active, onNavigate, pages }) {
  const { theme, toggle } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <CarIcon width={22} height={22} stroke="#fff" />
        </div>
        <div>
          <h2>CabsOnline</h2>
          <span className="brand-sub">Taxi Booking System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {pages.map((p) => {
          const Item = NAV_ITEMS[p];
          return (
            <button
              key={p}
              className={`nav-link${active === p ? " active" : ""}`}
              onClick={() => onNavigate(p)}
            >
              <span className="nav-icon">
                <Item.icon width={18} height={18} />
              </span>
              <span className="nav-text">{Item.label}</span>
              {active === p && <span className="nav-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggle}>
          {theme === "dark" ? (
            <><SunIcon width={16} height={16} /> <span>Light Mode</span></>
          ) : (
            <><MoonIcon width={16} height={16} /> <span>Dark Mode</span></>
          )}
        </button>
      </div>
    </aside>
  );
}
