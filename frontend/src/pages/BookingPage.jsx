/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: BookingPage.jsx
    Description: Booking form page where customers enter their pickup details.
    Includes an interactive map for selecting locations, client-side validation,
    and displays a confirmation card on successful submission.
*/
import { useState } from "react";
import { CarIcon } from "../components/Icons";
import LocationPicker from "../components/LocationPicker";
import { useToast } from "../components/Toast";

function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

function getNow() {
  const now = new Date();
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}

// Default form state — date and time are pre-filled with the current moment
const INITIAL = {
  cname: "", phone: "", snumber: "", stname: "",
  unumber: "", sbname: "", dsbname: "", ...getNow(),
};

export default function BookingPage() {
  const [form, setForm] = useState(INITIAL);
  const [confirmation, setConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pickupPos, setPickupPos] = useState(null);
  const [destPos, setDestPos] = useState(null);
  const toast = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.cname.trim() || !form.phone.trim() || !form.snumber.trim() || !form.stname.trim() || !form.date || !form.time) {
      return "Please fill in all required fields.";
    }
    if (!/^\d{10,12}$/.test(form.phone.trim())) {
      return "Phone number must be 10-12 digits.";
    }
    const pickup = new Date(`${form.date}T${form.time}`);
    if (isNaN(pickup.getTime()) || pickup < new Date()) {
      return "Pick-up date and time must not be in the past.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmation(null);
    const err = validate();
    if (err) { toast.show("error", err); return; }

    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      const res = await fetch("../part-1/booking.php", { method: "POST", body });
      const data = await res.json();
      if (data.success) { setConfirmation(data); }
      else { toast.show("error", data.error || "Booking failed."); }
    } catch {
      toast.show("error", "Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-fill address fields from the reverse geocode result when a pin is placed
  const handlePickupSelect = (latlng, address) => {
    setPickupPos(latlng);
    if (address) {
      setForm((prev) => ({
        ...prev,
        snumber: (address.house_number || prev.snumber).slice(0, 20),
        stname: (address.road || prev.stname).slice(0, 100),
        sbname: (address.suburb || address.city_district || address.town || prev.sbname).slice(0, 100),
      }));
    }
  };

  const handleDestSelect = (latlng, address) => {
    setDestPos(latlng);
    if (address) {
      setForm((prev) => ({
        ...prev,
        dsbname: (address.suburb || address.city_district || address.town || prev.dsbname).slice(0, 100),
      }));
    }
  };

  const handlePickupClear = () => {
    setPickupPos(null);
    setForm((prev) => ({ ...prev, snumber: "", stname: "", sbname: "" }));
  };

  const handleDestClear = () => {
    setDestPos(null);
    setForm((prev) => ({ ...prev, dsbname: "" }));
  };

  const handleNewBooking = () => {
    setConfirmation(null);
    setPickupPos(null);
    setDestPos(null);
    setForm({ ...INITIAL, ...getNow() });
  };

  if (confirmation) {
    return (
      <div className="page-center fade-in">
        <div className="success-card">
          <div className="success-icon">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
          </div>
          <h2>Booking Confirmed!</h2>
          <p className="success-sub">Your taxi has been booked successfully.</p>

          <div className="confirm-details">
            <div className="confirm-row">
              <span className="confirm-label">Reference</span>
              <span className="confirm-value highlight">{confirmation.bookingRef}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Pickup Date</span>
              <span className="confirm-value">{confirmation.pickupDate}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Pickup Time</span>
              <span className="confirm-value">{confirmation.pickupTime}</span>
            </div>
          </div>

          <button className="btn-primary btn-lg" onClick={handleNewBooking}>
            <CarIcon width={18} height={18} stroke="#fff" /> New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center fade-in">
      <div className="page-header">
        <div className="page-icon">
          <CarIcon width={24} height={24} />
        </div>
        <div>
          <h1>Book a Taxi</h1>
          <p className="page-subtitle">Fill in your pickup details to request a ride.</p>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <fieldset className="form-section">
          <legend>Personal Information</legend>
          <div className="form-row">
            <label>
              <span className="label-text">Customer Name <span className="req">*</span></span>
              <input type="text" name="cname" value={form.cname} onChange={handleChange} placeholder="John Smith" required />
            </label>
            <label>
              <span className="label-text">Phone Number <span className="req">*</span></span>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="0211234567" required />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Pickup &amp; Destination</legend>
          <LocationPicker
            pickupPos={pickupPos}
            destPos={destPos}
            onPickupSelect={handlePickupSelect}
            onDestSelect={handleDestSelect}
            onPickupClear={handlePickupClear}
            onDestClear={handleDestClear}
          />
          <div className="form-row">
            <label>
              <span className="label-text">Unit Number</span>
              <input type="text" name="unumber" value={form.unumber} onChange={handleChange} placeholder="e.g. 4A" />
            </label>
            <label>
              <span className="label-text">Street Number <span className="req">*</span></span>
              <input type="text" name="snumber" value={form.snumber} onChange={handleChange} placeholder="42" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="label-text">Street Name <span className="req">*</span></span>
              <input type="text" name="stname" value={form.stname} onChange={handleChange} placeholder="Queen Street" required />
            </label>
            <label>
              <span className="label-text">Suburb</span>
              <input type="text" name="sbname" value={form.sbname} onChange={handleChange} placeholder="Auckland CBD" />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="label-text">Destination Suburb</span>
              <input type="text" name="dsbname" value={form.dsbname} onChange={handleChange} placeholder="Ponsonby" />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Pickup Schedule</legend>
          <div className="form-row">
            <label>
              <span className="label-text">Pick-Up Date <span className="req">*</span></span>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>
              <span className="label-text">Pick-Up Time <span className="req">*</span></span>
              <input type="time" name="time" value={form.time} onChange={handleChange} required />
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn-primary btn-lg btn-submit" disabled={submitting}>
          {submitting ? (
            <><span className="spinner" /> Processing...</>
          ) : (
            <><CarIcon width={18} height={18} stroke="#fff" /> Book Taxi</>
          )}
        </button>
      </form>
    </div>
  );
}
