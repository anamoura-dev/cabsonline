/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: AdminPage.jsx
    Description: Admin panel page for managing taxi bookings. Allows staff to
    search, view, assign, edit, and delete bookings fetched from the backend API.
*/
import { useState, useEffect } from "react";
import { useBookings } from "../context/BookingContext";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import {
  ClipboardIcon, SearchIcon, EditIcon, TrashIcon,
  CheckCircleIcon, ListIcon, UserIcon, PhoneIcon,
  CalendarIcon, NavigationIcon, RefreshIcon,
} from "../components/Icons";

export default function AdminPage() {
  const {
    bookings, loading, error,
    fetchBookings, assignBooking, updateBooking, deleteBooking,
  } = useBookings();

  const [searchRef, setSearchRef] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const toast = useToast();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Validate format before sending to the API to avoid unnecessary requests
  const handleSearch = () => {
    if (searchRef.trim() && !/^BRN\d{5}$/.test(searchRef.trim())) {
      toast.show("error", "Format must be BRN followed by 5 digits (e.g. BRN00001).");
      return;
    }
    fetchBookings(searchRef.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAssign = async (ref) => {
    const result = await assignBooking(ref);
    toast.show(result.success ? "success" : "error", result.message);
  };

  // Ask for confirmation before deleting since the action is irreversible
  const handleDelete = async (ref) => {
    if (!window.confirm(`Are you sure you want to delete ${ref}? This cannot be undone.`)) return;
    const result = await deleteBooking(ref);
    toast.show(
      result.success ? "success" : "error",
      result.success ? `Booking ${ref} has been deleted.` : result.message
    );
  };

  const openEdit = (booking) => {
    setEditData({ ...booking });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    const result = await updateBooking(editData.booking_ref, editData);
    if (result.success) {
      toast.show("success", "Booking updated successfully.");
      setEditModal(false);
      fetchBookings(searchRef.trim());
    } else {
      toast.show("error", result.message);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-icon"><ClipboardIcon width={24} height={24} /></div>
        <div>
          <h1>Admin Panel</h1>
          <p className="page-subtitle">Manage and assign taxi bookings.</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <SearchIcon width={16} height={16} />
          <input
            type="text"
            placeholder="Search by reference (e.g. BRN00001)"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="btn-primary" onClick={handleSearch}>
          <SearchIcon width={15} height={15} stroke="#fff" /> Search
        </button>
        <button className="btn-secondary" onClick={() => { setSearchRef(""); fetchBookings(); }}>
          <ListIcon width={15} height={15} /> All
        </button>
        <button className="btn-icon" onClick={() => fetchBookings(searchRef.trim())} title="Refresh">
          <RefreshIcon width={16} height={16} />
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading-state">
          <span className="spinner spinner-lg" />
          <p>Loading bookings...</p>
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="empty-state">
          <ClipboardIcon width={48} height={48} />
          <h3>No bookings found</h3>
          <p>Try a different search or click "All" to view everything.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <>
          <div className="result-count">
            Showing <strong>{bookings.length}</strong> booking{bookings.length !== 1 ? "s" : ""}
          </div>
          <div className="booking-grid">
            {bookings.map((b) => (
              <div className="booking-card" key={b.booking_ref}>
                <div className="card-header">
                  <span className="card-ref">{b.booking_ref}</span>
                  <span className={`badge badge-${b.status}`}>
                    {b.status === "assigned" && <CheckCircleIcon width={11} height={11} />}
                    {b.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <UserIcon /> <span>{b.customer_name}</span>
                  </div>
                  <div className="card-row">
                    <PhoneIcon /> <span>{b.phone}</span>
                  </div>
                  <div className="card-row">
                    <NavigationIcon />
                    <span>
                      {b.unit_number ? b.unit_number + "/" : ""}
                      {b.street_number} {b.street_name}
                      {b.suburb ? `, ${b.suburb}` : ""}
                    </span>
                  </div>
                  {b.destination_suburb && (
                    <div className="card-row card-row-dest">
                      <NavigationIcon /> <span>{b.destination_suburb}</span>
                    </div>
                  )}
                  <div className="card-row">
                    <CalendarIcon /> <span>{b.pickup_date} at {b.pickup_time}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-action btn-action-edit" onClick={() => openEdit(b)} title="Edit">
                    <EditIcon width={14} height={14} /> Edit
                  </button>
                  {b.status === "unassigned" ? (
                    <button className="btn-action btn-action-assign" onClick={() => handleAssign(b.booking_ref)} title="Assign taxi">
                      <CheckCircleIcon width={14} height={14} /> Assign
                    </button>
                  ) : (
                    <button className="btn-action btn-action-done" disabled title="Already assigned">
                      <CheckCircleIcon width={14} height={14} /> Assigned
                    </button>
                  )}
                  <button className="btn-action btn-action-delete" onClick={() => handleDelete(b.booking_ref)} title="Delete">
                    <TrashIcon width={14} height={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Booking">
        {editData && (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
            <label><span className="label-text">Customer Name</span>
              <input type="text" name="customer_name" value={editData.customer_name || ""} onChange={handleEditChange} />
            </label>
            <label><span className="label-text">Phone</span>
              <input type="text" name="phone" value={editData.phone || ""} onChange={handleEditChange} />
            </label>
            <div className="form-row">
              <label><span className="label-text">Unit</span>
                <input type="text" name="unit_number" value={editData.unit_number || ""} onChange={handleEditChange} />
              </label>
              <label><span className="label-text">Street No.</span>
                <input type="text" name="street_number" value={editData.street_number || ""} onChange={handleEditChange} />
              </label>
            </div>
            <label><span className="label-text">Street Name</span>
              <input type="text" name="street_name" value={editData.street_name || ""} onChange={handleEditChange} />
            </label>
            <div className="form-row">
              <label><span className="label-text">Suburb</span>
                <input type="text" name="suburb" value={editData.suburb || ""} onChange={handleEditChange} />
              </label>
              <label><span className="label-text">Destination</span>
                <input type="text" name="destination_suburb" value={editData.destination_suburb || ""} onChange={handleEditChange} />
              </label>
            </div>
            <div className="form-row">
              <label><span className="label-text">Date</span>
                <input type="date" name="pickup_date" value={editData.pickup_date || ""} onChange={handleEditChange} />
              </label>
              <label><span className="label-text">Time</span>
                <input type="time" name="pickup_time" value={editData.pickup_time || ""} onChange={handleEditChange} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn-secondary" onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
