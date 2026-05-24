import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { BookingProvider } from "./context/BookingContext";
import { ToastProvider } from "./components/Toast";
import "leaflet/dist/leaflet.css";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BookingProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BookingProvider>
    </ThemeProvider>
  </React.StrictMode>
);
