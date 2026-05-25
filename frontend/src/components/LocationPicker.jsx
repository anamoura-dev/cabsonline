/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: LocationPicker.jsx
    Description: Interactive map component for selecting pickup and destination
    locations. Clicking the map places a draggable pin and reverse-geocodes the
    coordinates into an address using the Nominatim OpenStreetMap API.
*/
import { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const AUCKLAND_CENTER = [-36.8485, 174.7633];

function makeSvgIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 28 42">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 28 14 28s14-17.5 14-28C28 6.27 21.73 0 14 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="6" fill="#fff"/>
  </svg>`;
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });
}

const pickupIcon = makeSvgIcon("#22d3ee");
const destIcon = makeSvgIcon("#4ade80");

const userLocIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="#fff" stroke-width="2.5"/>
    </svg>`
  )}`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Converts lat/lng to a human-readable address using the free Nominatim API
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.address || null;
  } catch {
    return null;
  }
}

function ClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

function FlyToUser({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger) map.flyTo(trigger, 15, { duration: 1 });
  }, [trigger, map]);
  return null;
}

function DraggableMarker({ position, icon, onDragEnd }) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(() => ({
    dragend() {
      const m = markerRef.current;
      if (m) onDragEnd(m.getLatLng());
    },
  }), [onDragEnd]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      draggable
      eventHandlers={eventHandlers}
    />
  );
}

export default function LocationPicker({
  pickupPos,
  destPos,
  onPickupSelect,
  onDestSelect,
  onPickupClear,
  onDestClear,
}) {
  const [mode, setMode] = useState("pickup");
  const [loading, setLoading] = useState(false);
  const [userLoc, setUserLoc] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle");
  const geoRequested = useRef(false);

  useEffect(() => {
    if (geoRequested.current) return;
    geoRequested.current = true;
    if (!navigator.geolocation) return;
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        setGeoStatus("success");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        setGeoStatus("success");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Alternates between pickup and destination mode after each click
  const handleMapClick = async (latlng) => {
    setLoading(true);
    const address = await reverseGeocode(latlng.lat, latlng.lng);
    setLoading(false);
    if (mode === "pickup") {
      onPickupSelect(latlng, address);
      setMode("destination");
    } else {
      onDestSelect(latlng, address);
      setMode("pickup");
    }
  };

  const handlePickupDragEnd = async (latlng) => {
    setLoading(true);
    const address = await reverseGeocode(latlng.lat, latlng.lng);
    setLoading(false);
    onPickupSelect(latlng, address);
  };

  const handleDestDragEnd = async (latlng) => {
    setLoading(true);
    const address = await reverseGeocode(latlng.lat, latlng.lng);
    setLoading(false);
    onDestSelect(latlng, address);
  };

  return (
    <div className="location-picker">
      <div className="picker-toolbar">
        <div className="picker-hint">
          {loading ? (
            <><span className="spinner" /> Resolving address...</>
          ) : mode === "pickup" ? (
            <>Click on the map to set <strong>pickup</strong> location</>
          ) : (
            <>Click on the map to set <strong>destination</strong> location</>
          )}
        </div>
        <div className="picker-mode-btns">
          <button
            type="button"
            className={`picker-mode-btn${mode === "pickup" ? " active pickup" : ""}`}
            onClick={() => setMode("pickup")}
          >
            <span className="picker-dot pickup-dot" /> Pickup
          </button>
          <button
            type="button"
            className={`picker-mode-btn${mode === "destination" ? " active destination" : ""}`}
            onClick={() => setMode("destination")}
          >
            <span className="picker-dot dest-dot" /> Destination
          </button>
        </div>
      </div>

      <div className="picker-map-wrap">
        <MapContainer
          center={userLoc || AUCKLAND_CENTER}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "0 0 10px 10px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={handleMapClick} />
          <FlyToUser trigger={userLoc} />
          {userLoc && <Marker position={userLoc} icon={userLocIcon} />}
          {pickupPos && (
            <DraggableMarker
              position={[pickupPos.lat, pickupPos.lng]}
              icon={pickupIcon}
              onDragEnd={handlePickupDragEnd}
            />
          )}
          {destPos && (
            <DraggableMarker
              position={[destPos.lat, destPos.lng]}
              icon={destIcon}
              onDragEnd={handleDestDragEnd}
            />
          )}
        </MapContainer>
        <button type="button" className="picker-locate-btn" onClick={handleLocateMe} title="Center on my location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          {geoStatus === "loading" ? <span className="spinner" /> : "My Location"}
        </button>
      </div>

      {(pickupPos || destPos) && (
        <div className="picker-legend">
          {pickupPos && (
            <span className="legend-item">
              <span className="picker-dot pickup-dot" /> Pickup set
              <button type="button" className="picker-clear-btn" onClick={onPickupClear} title="Remove pickup">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {destPos && (
            <span className="legend-item">
              <span className="picker-dot dest-dot" /> Destination set
              <button type="button" className="picker-clear-btn" onClick={onDestClear} title="Remove destination">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
