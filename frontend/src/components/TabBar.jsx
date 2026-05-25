/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: TabBar.jsx
    Description: Fixed bottom navigation bar shown on mobile screens.
    Mirrors the sidebar navigation with icons and short labels.
*/
import { CarIcon, ClipboardIcon, ChartIcon, MapPinIcon } from "./Icons";

const TAB_ITEMS = {
  booking: { icon: CarIcon, label: "Booking" },
  admin: { icon: ClipboardIcon, label: "Admin" },
  dashboard: { icon: ChartIcon, label: "Stats" },
  map: { icon: MapPinIcon, label: "Map" },
};

export default function TabBar({ active, onNavigate, pages }) {
  return (
    <nav className="tabbar">
      {pages.map((p) => {
        const Item = TAB_ITEMS[p];
        return (
          <button
            key={p}
            className={`tab-link${active === p ? " active" : ""}`}
            onClick={() => onNavigate(p)}
          >
            <span className="tab-icon">
              <Item.icon width={20} height={20} />
            </span>
            <span className="tab-label">{Item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
