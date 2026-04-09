import { createContext, useContext, useState, useCallback } from "react";

const BookingContext = createContext();

const API = "/api/admin.php";

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (searchRef = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = searchRef
        ? `${API}?action=search&bsearch=${encodeURIComponent(searchRef)}`
        : `${API}?action=list`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setError(data.error || "Failed to load bookings.");
        setBookings([]);
      }
    } catch {
      setError("Connection error.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignBooking = useCallback(async (ref, newStatus = "assigned") => {
    try {
      const res = await fetch(
        `${API}?action=assign&ref=${encodeURIComponent(ref)}&status=${encodeURIComponent(newStatus)}`
      );
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.booking_ref === ref ? { ...b, status: newStatus } : b
          )
        );
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error };
    } catch {
      return { success: false, message: "Connection error." };
    }
  }, []);

  const updateBooking = useCallback(async (ref, fields) => {
    try {
      const body = new FormData();
      body.append("action", "update");
      body.append("ref", ref);
      Object.entries(fields).forEach(([k, v]) => body.append(k, v));
      const res = await fetch(API, { method: "POST", body });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.booking_ref === ref ? { ...b, ...fields } : b))
        );
        return { success: true };
      }
      return { success: false, message: data.error };
    } catch {
      return { success: false, message: "Connection error." };
    }
  }, []);

  const deleteBooking = useCallback(async (ref) => {
    try {
      const res = await fetch(
        `${API}?action=delete&ref=${encodeURIComponent(ref)}`
      );
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.booking_ref !== ref));
        return { success: true };
      }
      return { success: false, message: data.error };
    } catch {
      return { success: false, message: "Connection error." };
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        error,
        fetchBookings,
        assignBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
