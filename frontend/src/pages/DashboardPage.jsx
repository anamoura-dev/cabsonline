/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: DashboardPage.jsx
    Description: Dashboard page showing booking statistics. Displays total,
    assigned, and unassigned counts, assignment rate, and a bar chart of
    bookings per day for the last 14 days.
*/
import { useEffect, useMemo } from "react";
import { useBookings } from "../context/BookingContext";
import { ChartIcon, CarIcon, CheckCircleIcon } from "../components/Icons";

export default function DashboardPage() {
  const { bookings, loading, fetchBookings } = useBookings();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Recalculate stats only when bookings change
  const stats = useMemo(() => {
    const total = bookings.length;
    const assigned = bookings.filter((b) => b.status === "assigned").length;
    const unassigned = total - assigned;
    const rate = total > 0 ? Math.round((assigned / total) * 100) : 0;

    // Group bookings by pickup date for the bar chart
    const byDay = {};
    bookings.forEach((b) => {
      const day = b.pickup_date || "Unknown";
      byDay[day] = (byDay[day] || 0) + 1;
    });
    // Sort chronologically and keep only the last 14 days
    const sortedDays = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-14);
    const maxDayCount = Math.max(...sortedDays.map(([, c]) => c), 1);

    return { total, assigned, unassigned, rate, sortedDays, maxDayCount };
  }, [bookings]);

  if (loading) {
    return (
      <div className="loading-state fade-in">
        <span className="spinner spinner-lg" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-icon"><ChartIcon width={24} height={24} /></div>
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of booking statistics.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <CarIcon width={22} height={22} />
          </div>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card stat-assigned">
          <div className="stat-icon-wrap stat-icon-success">
            <CheckCircleIcon width={22} height={22} />
          </div>
          <span className="stat-value">{stats.assigned}</span>
          <span className="stat-label">Assigned</span>
        </div>
        <div className="stat-card stat-unassigned">
          <div className="stat-icon-wrap stat-icon-warning">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <span className="stat-value">{stats.unassigned}</span>
          <span className="stat-label">Unassigned</span>
        </div>
        <div className="stat-card stat-rate">
          <div className="stat-icon-wrap stat-icon-info">
            <ChartIcon width={22} height={22} />
          </div>
          <span className="stat-value">{stats.rate}%</span>
          <span className="stat-label">Assignment Rate</span>
        </div>
      </div>

      <div className="chart-section">
        <h2 className="section-title">Bookings per Day</h2>
        {stats.sortedDays.length === 0 ? (
          <div className="empty-state">
            <ChartIcon width={48} height={48} />
            <h3>No data yet</h3>
            <p>Bookings will appear here once created.</p>
          </div>
        ) : (
          <div className="chart-container">
            <div className="chart">
              {stats.sortedDays.map(([day, count]) => (
                <div className="chart-bar-group" key={day}>
                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: `${(count / stats.maxDayCount) * 100}%` }}
                    >
                      <span className="chart-bar-value">{count}</span>
                    </div>
                  </div>
                  <span className="chart-label">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
