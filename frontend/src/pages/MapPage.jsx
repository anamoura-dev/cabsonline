/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: MapPage.jsx
    Description: Map view page that displays pickup and destination locations
    for all bookings. Uses a suburb-to-coordinate lookup to place markers on
    a Leaflet map centred on Auckland.
*/
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useBookings } from "../context/BookingContext";
import { MapPinIcon } from "../components/Icons";

const AUCKLAND_CENTER = [-36.8485, 174.7633];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Static lookup table mapping Auckland suburb names to lat/lng coordinates
const SUBURB_COORDS = {
  "auckland cbd": [-36.8485, 174.7633],
  "ponsonby": [-36.8557, 174.7432],
  "parnell": [-36.8556, 174.7823],
  "newmarket": [-36.8705, 174.7778],
  "grey lynn": [-36.8607, 174.7345],
  "mt eden": [-36.8776, 174.7568],
  "epsom": [-36.8901, 174.7706],
  "remuera": [-36.8752, 174.7937],
  "mission bay": [-36.8485, 174.8105],
  "takapuna": [-36.7876, 174.7717],
  "devonport": [-36.8307, 174.7943],
  "mt albert": [-36.8867, 174.7186],
  "henderson": [-36.8773, 174.6316],
  "manukau": [-36.9934, 174.8781],
  "onehunga": [-36.9268, 174.7858],
  "ellerslie": [-36.8956, 174.8070],
  "penrose": [-36.9055, 174.8050],
  "grafton": [-36.8595, 174.7680],
  "mt wellington": [-36.9056, 174.8299],
  "otahuhu": [-36.9450, 174.8345],
};

function geocodeSuburb(suburb) {
  if (!suburb) return null;
  return SUBURB_COORDS[suburb.toLowerCase().trim()] || null;
}

export default function MapPage() {
  const { bookings, fetchBookings } = useBookings();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Build the marker list from bookings — skips any suburb not found in SUBURB_COORDS
  const markers = useMemo(() => {
    const result = [];
    bookings.forEach((b) => {
      const coords = geocodeSuburb(b.suburb);
      if (coords) {
        result.push({
          key: b.booking_ref + "-pickup",
          position: coords,
          label: `Pickup: ${b.booking_ref}`,
          detail: `${b.customer_name} — ${b.suburb}`,
        });
      }
      const destCoords = geocodeSuburb(b.destination_suburb);
      if (destCoords) {
        result.push({
          key: b.booking_ref + "-dest",
          position: destCoords,
          label: `Destination: ${b.booking_ref}`,
          detail: `${b.customer_name} → ${b.destination_suburb}`,
        });
      }
    });
    return result;
  }, [bookings]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-icon"><MapPinIcon width={24} height={24} /></div>
        <div>
          <h1>Booking Map</h1>
          <p className="page-subtitle">
            {markers.length > 0
              ? `Showing ${markers.length} location${markers.length !== 1 ? "s" : ""} on the map.`
              : "No geocodable suburbs found. Try bookings with Auckland suburb names."}
          </p>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={AUCKLAND_CENTER}
          zoom={12}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m) => (
            <Marker key={m.key} position={m.position} icon={markerIcon}>
              <Popup>
                <strong>{m.label}</strong><br />{m.detail}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
