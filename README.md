# CabsOnline — Part 2 React Application

**Student:** Ana Carolina Alves de Moura
**Student ID:** 23201111
**Course:** Web Development
**Date:** May 2026

---

## 1. Deployed URL

Hosted at <https://webdev.aut.ac.nz/~bvf2703/assign/part-2/>.

It runs locally at `http://localhost:5173` (see [section 3](#3-how-to-run-and-build-locally) for how to run it). The production build (`npm run build`) outputs to `dist/` and can be deployed to any static host like Vercel or Netlify.

## 2. Technology Stack

- **React 19.1.0** with **Vite 6.3.1**
- **No routing library** — page navigation is handled with a single `activePage` state variable in `App.jsx`
- **React Context API** for global state (`BookingContext` for CRUD, `ThemeContext` for dark/light mode)
- **Leaflet 1.9.4 + react-leaflet 5.0.0** for maps, with OpenStreetMap tiles
- **Nominatim** (OpenStreetMap) for reverse geocoding in the booking form
- **Plain CSS** with custom properties for theming, no CSS framework
- **No charting library** — the dashboard bar chart is built with inline SVG

## 3. How to Run and Build Locally

You need **Node.js 18+** and the Part 1 PHP backend running at `localhost:8080` (see [`backend/readme.txt`](backend/readme.txt)).

To start the dev server:

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The Vite dev server proxies all `/part-1/*` requests to the PHP backend so there are no CORS issues.

To build for production:

```bash
npm run build
```

The output goes to `dist/` and can be dropped into any static hosting service.

## 4. API Endpoints

All requests go through the Vite proxy at `/part-1/*` in development, which forwards to `http://localhost:8080`.

### `booking.php` (POST) — creates a new booking

| | Fields |
|---|---|
| **Required** | `cname`, `phone`, `snumber`, `stname`, `date`, `time` |
| **Optional** | `unumber`, `sbname`, `dsbname` |
| **Returns** | `{ success, bookingRef, pickupDate, pickupTime }` |

### `admin.php` (GET) — used across the Admin, Dashboard and Map pages

| Query | What it does |
|---|---|
| `?action=list` | returns all bookings |
| `?action=search&bsearch=BRN00001` | finds a specific booking |
| `?action=assign&ref=BRN00001&status=assigned` | assigns a taxi |
| `?action=assign&ref=BRN00001&status=unassigned` | unassigns |
| `?action=delete&ref=BRN00001` | deletes a booking |

### `admin.php` (POST) — used by the edit modal in the Admin page

Fields: `action=update`, `ref`, and any booking fields to update.

### Nominatim (GET) — used by the `LocationPicker` component

```
https://nominatim.openstreetmap.org/reverse?lat=...&lon=...&format=json
```

Called whenever the user places or drags a marker on the booking form map.

## 5. Features

The app extends Part 1 with four extra features.

### Full CRUD admin panel

The Admin page shows all bookings as cards. You can assign or unassign a taxi with one click, edit any field through a modal dialog, and delete a booking. Changes are reflected immediately without a page reload.

### Dashboard with statistics

Shows total, assigned and unassigned booking counts, plus a bar chart of bookings created per day over the last 14 days.

### Dark/light mode

A toggle in the sidebar (desktop) and header (mobile) switches the theme. It uses CSS custom properties so the whole UI updates instantly. The preference is saved in `localStorage` and restored on the next visit.

### Interactive map

There are two map experiences.

In the **booking form**, a Leaflet map lets you click to place a pickup marker (cyan) and a destination marker (green). After placing each marker the app calls the Nominatim reverse-geocoding API and automatically fills in the address fields. Markers are draggable — moving one updates the fields again. There is also a "My Location" button that uses the browser Geolocation API to centre the map on the user.

The **second map** is a separate page that plots all existing bookings on an Auckland-centred map, matching suburb names against a built-in dictionary of coordinates. Clicking a marker shows the booking reference and customer name.

All async actions (booking confirmed, taxi assigned, edit saved, errors) show a colour-coded toast notification that fades out automatically.

## 6. Testing

To test, first create a booking with these details:

| Field | Value |
|---|---|
| Name | Jane Doe |
| Phone | 0211234567 |
| Street number | 42 |
| Street name | Queen Street |
| Suburb | Auckland CBD |
| Destination | Ponsonby |
| Date/time | anything in the future |

The booking will get a reference like `BRN00001`. Use that reference in the Admin page search to find and manage it.

**Suburbs that work with the Map page:**

Auckland CBD, Ponsonby, Parnell, Newmarket, Grey Lynn, Mt Eden, Epsom, Remuera, Mission Bay, Takapuna, Devonport, Mt Albert, Henderson, Manukau, Onehunga, Ellerslie, Penrose, Grafton, Mt Wellington, Otahuhu.

**Things to check manually:**

- [ ] Booking form rejects empty fields, wrong phone formats and past dates
- [ ] Clicking the map fills in the address fields
- [ ] Dragging a marker updates the fields again
- [ ] "My Location" centres the map (browser will ask for permission)
- [ ] Admin assign/unassign, edit and delete all update the card immediately
- [ ] Dashboard counts change after you add or remove a booking
- [ ] Map page shows markers for bookings with recognised suburb names
- [ ] Theme toggle works and persists after refresh
- [ ] Active page persists after refresh
- [ ] Layout switches between sidebar (desktop) and tab bar (mobile)

Tested on Chrome, Edge and Firefox.

## 7. Known Limitations

- The Map page only recognises about 20 Auckland suburbs. Anything else won't appear as a marker. The booking form map is not affected since it uses live geocoding.
- The Nominatim API has a rate limit of one request per second. Dragging markers quickly could cause some requests to be delayed or dropped.
- Both maps need an internet connection to load the OpenStreetMap tiles.
- The admin panel has no login. Anyone with the URL can view and modify all bookings. Not suitable for a real production environment.
- All bookings load at once. For a large number of records this would be slow, but it's fine for this project's scope.
- Booking reference numbers use `COUNT(*) + 1`, so deleting bookings and creating new ones could eventually produce duplicates.

## 8. AI Reflection

I used Claude (through Cursor IDE and the Claude Code CLI) throughout this project.

It was most helpful for getting started quickly — generating the initial component structure, the Context API setup, and the CSS theming system saved a lot of time. It was also good at explaining why something wasn't working, like when I had a mismatch between the PHP column names and the React field names that was silently dropping the suburb data.

For the `LocationPicker` specifically, I described what I wanted (click to set pickup, click again for destination, auto-fill the form from the coordinates) and it gave me a solid starting point. The suggestion to use one shared geocoding function for both the click handler and the drag handler made the component much cleaner than what I had started with.

That said, I had to review everything carefully. The AI got the Nominatim response field names wrong at first (using `lng` instead of `lon`), which caused the geocoding to silently fail. I only caught it by reading the API docs myself. It also sometimes suggested patterns that were more complex than needed — a few `useEffect` hooks got replaced with simpler event-driven updates once I understood what the code actually needed to do.

The biggest thing I took away is that AI is a good collaborator when you know what you're building and can judge whether the output is correct. It speeds things up but doesn't replace understanding the code.
