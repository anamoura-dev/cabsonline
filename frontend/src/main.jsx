/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: main.jsx
    Description: Entry point of the React application. Wraps the app in all
    required context providers (theme, bookings, toasts) and mounts it to the DOM.
*/
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
