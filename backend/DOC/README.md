# CabsOnline — Project Documentation

**Student:** Ana Carolina Alves de Moura
**Student ID:** 23201111
**Course:** Web Development
**Date:** April 2026

---

## 1. Deployed URL

- **Part 1 (PHP):** `http://webdev.aut.ac.nz/bvf2703/` (uploaded to the webdev server)
- **Part 2 (React):** Deployed locally or via GitHub Pages / Vercel (static build from `part2/dist/`)

---

## 2. Technology Stack

### Part 1 — Server-side Assignment (`assign/`)
| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | PHP 8.x |
| Database | MySQL (on `webdev.aut.ac.nz`) |
| Communication | Fetch API (asynchronous JSON) |

### Part 2 — React Application (`part2/`)
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6 |
| Routing | Client-side page switching (state-based SPA) |
| State | React Context API (`BookingContext`, `ThemeContext`) |
| Map | Leaflet + react-leaflet |
| Styling | CSS custom properties (dark/light theme) |
| Backend | Reuses the same PHP API from Part 1 via Vite proxy |

---

## 3. How to Run

### Part 1 — Deploy on Server webdev.aut.ac.nz

**Step 1 — Preper database on webdev:**
1. Turn on the MySQL on webdev via SSH ou phpMyAdmin
2. Executar os comandos contidos em `assign/mysqlcommand.txt`:
   ```sql
   CREATE DATABASE IF NOT EXISTS bvf2703;
   USE bvf2703;
   CREATE TABLE IF NOT EXISTS bookings ( ... );
   ```

**Passo 2 — Upload dos ficheiros:**
1. Ligar ao webdev via SFTP (por ex. FileZilla, WinSCP ou terminal):
   ```
   Host: webdev.aut.ac.nz
   Username: bvf2703
   Protocol: SFTP (porta 22)
   ```
2. Navegar até `htdocs/assign/`
3. Fazer upload de **todos** os ficheiros dentro da pasta local `assign/`:
   - `booking.html`, `booking.js`, `booking.php`
   - `admin.html`, `admin.js`, `admin.php`
   - `style.css`, `mysqlcommand.txt`, `readme.txt`
4. **Não criar subpastas** — todos os ficheiros devem ficar directamente em `htdocs/assign/`

**Passo 3 — Testar:**
- Booking: `http://webdev.aut.ac.nz/bvf2703/assign/booking.html`
- Admin: `http://webdev.aut.ac.nz/bvf2703/assign/admin.html`

> **Nota:** Os ficheiros PHP em `assign/` têm as credenciais do webdev hardcoded (`host: webdev.aut.ac.nz`, `db: bvf2703`, `user: bvf2703`), conforme exigido pelo enunciado.

---

### Part 1 — Correr Localmente (desenvolvimento)

1. Copiar `.env.example` para `.env` e configurar credenciais locais:
   ```
   DB_HOST=localhost
   DB_NAME=bvf2703
   DB_USER=root
   DB_PASSWORD=
   ```
2. Criar a base de dados local:
   ```bash
   mysql -u root -e "SOURCE mysqlcommand.txt"
   ```
3. Iniciar o servidor PHP na raiz do projecto:
   ```bash
   php -S localhost:8080
   ```
4. Abrir no browser:
   - `http://localhost:8080/assign/booking.html`
   - `http://localhost:8080/assign/admin.html`

> **Nota:** Para dev local, os ficheiros da raiz (`booking.php`, `admin.php`) usam `includes/bootstrap.php` que lê o `.env`. Os ficheiros em `assign/` usam credenciais hardcoded do webdev e **não funcionam localmente** sem alterar as credenciais.

---

### Part 2 — React (desenvolvimento local)

1. Garantir que **Node.js 18+** está instalado
2. Iniciar o backend PHP (na raiz do projecto):
   ```bash
   php -S localhost:8080
   ```
3. Instalar dependências e iniciar o servidor de desenvolvimento:
   ```bash
   cd part2
   npm install
   npm run dev
   ```
4. Abrir `http://localhost:5173` no browser
5. O proxy do Vite redireciona `/api/*` para `localhost:8080` automaticamente

### Part 2 — Build de Produção
```bash
cd part2
npm run build
```
Os ficheiros estáticos são gerados em `part2/dist/`. Estes podem ser deployed em qualquer servidor web estático (GitHub Pages, Vercel, Netlify, etc.).

---

## 4. API Endpoints (PHP Backend)

### `booking.php` — POST
Creates a new booking.

**Parameters (FormData):**
| Field | Required | Description |
|-------|----------|-------------|
| cname | Yes | Customer name |
| phone | Yes | Phone (10-12 digits) |
| snumber | Yes | Street number |
| stname | Yes | Street name |
| unumber | No | Unit number |
| sbname | No | Suburb |
| dsbname | No | Destination suburb |
| date | Yes | Pickup date (YYYY-MM-DD) |
| time | Yes | Pickup time (HH:MM) |

**Response (JSON):**
```json
{
  "success": true,
  "bookingRef": "BRN00001",
  "pickupDate": "09/04/2026",
  "pickupTime": "14:30"
}
```

### `admin.php` — GET

| Action | Parameters | Description |
|--------|-----------|-------------|
| `?action=search` | (none) | Returns unassigned bookings within 2 hours |
| `?action=search&bsearch=BRN00001` | bsearch | Returns exact booking match |
| `?action=list` | (none) | Returns all bookings (Part 2 only) |
| `?action=assign&ref=BRN00001&status=assigned` | ref, status | Assigns/unassigns a taxi |
| `?action=delete&ref=BRN00001` | ref | Deletes a booking (Part 2 only) |

### `admin.php` — POST

| Action | Parameters | Description |
|--------|-----------|-------------|
| `action=update` | ref, customer_name, phone, etc. | Updates booking fields (Part 2 only) |

---

## 5. Features

### Part 1 Features
1. **Booking Form** — Customer fills in pickup details; date/time pre-filled with current values.
2. **Client-side Validation** — Required fields, phone format (10-12 digits), date/time not in past.
3. **Async Submission** — Form data sent via `fetch()` POST; JSON response displayed without page reload.
4. **Booking Reference** — Auto-generated incremental BRN format (BRN00001, BRN00002, ...).
5. **Admin Search** — Search by exact reference number, or view unassigned bookings within 2 hours.
6. **Taxi Assignment** — One-click assign button; status updates to "assigned" in real time.

### Part 2 Additional Features (4 extras)
1. **Full CRUD** — Create, Read, Update, and Delete bookings via the Admin Panel with card-based UI and edit modal.
2. **Dashboard with Statistics** — Total, assigned, and unassigned counts; bar chart showing bookings per day (last 14 days).
3. **Dark/Light Mode** — Theme toggle with CSS custom properties; persisted in `localStorage`.
4. **Interactive Map** — Leaflet map showing pickup and destination locations based on Auckland suburb geocoding.

---

## 6. Testing

### Manual Testing Checklist
- [ ] Booking form validates required fields (show error if empty).
- [ ] Phone validation rejects non-numeric and wrong-length inputs.
- [ ] Date/time in the past is rejected by both client and server.
- [ ] Successful booking displays reference number, date, and time.
- [ ] Admin search by reference returns exact match.
- [ ] Empty search returns unassigned bookings within 2 hours.
- [ ] Assign button changes status to "assigned" and disables button.
- [ ] Part 2: Edit modal updates booking details.
- [ ] Part 2: Delete removes the booking from the list.
- [ ] Part 2: Dashboard statistics update after bookings change.
- [ ] Part 2: Map shows markers for recognized Auckland suburbs.
- [ ] Part 2: Theme toggle switches between dark and light mode.
- [ ] Part 2: Active page and theme persist across page reloads.
- [ ] Responsive layout works on mobile (tab bar) and desktop (sidebar).

### Browser Compatibility
Tested on: Google Chrome (latest), Microsoft Edge (latest), Firefox (latest).

---

## 7. Known Limitations

1. **Suburb geocoding is static** — The map uses a predefined dictionary of Auckland suburb coordinates. Suburbs not in the dictionary will not appear on the map.
2. **Booking reference generation** — Uses `COUNT(*) + 1` which may produce duplicates if bookings are deleted and re-inserted. A production system should use a dedicated sequence table.
3. **No authentication** — The admin panel has no login or access control. In a real system, admin endpoints should be protected.
4. **No pagination** — The admin booking list loads all records at once. For large datasets, server-side pagination would be needed.
5. **PHP credentials hardcoded (Part 1)** — Required by the webdev server environment. Part 2 uses environment variables for local development.

---

## 8. AI Reflection

This project was developed with the assistance of an AI coding tool (Cursor with Claude). The AI helped with:

- **Scaffolding** — Generating the initial project structure, React components, and CSS.
- **Debugging** — Identifying incorrect SQL column names, PHP extension issues, and JavaScript date parsing bugs.
- **Best practices** — Suggesting PDO prepared statements, input validation on both client and server, and CSS custom properties for theming.
- **Responsiveness** — Implementing the mobile tab bar and card-based layout to replace tables on small screens.

**What I learned from AI assistance:**
- AI is excellent at generating boilerplate code and suggesting patterns, but the developer must understand the code to debug and adapt it to specific requirements.
- The assignment required very specific HTML attribute names (e.g., `name="cname"`, `name="bsearch"`), which the AI initially missed. Careful review against the specification was essential.
- AI-generated code sometimes needs to be restructured to match deployment constraints (e.g., hardcoded credentials for the webdev server).

---

## 9. Environment Variables (Local Development)

1. Copy `.env.example` to `.env` in the repository root.
2. Edit `.env` with your local database credentials:
   ```
   DB_HOST=localhost
   DB_NAME=bvf2703
   DB_USER=root
   DB_PASSWORD=
   DB_CHARSET=utf8
   ```
3. The PHP files in the root directory load `.env` via `includes/bootstrap.php`.
4. The `assign/` folder uses hardcoded credentials for the webdev server (as required).
5. Do not commit the `.env` file (it is in `.gitignore`).

---

## 10. Repository Structure

```
cabsonline/
├── assign/                  ← Part 1 (deploy to webdev)
│   ├── booking.html
│   ├── booking.js
│   ├── booking.php
│   ├── admin.html
│   ├── admin.js
│   ├── admin.php
│   ├── style.css
│   ├── mysqlcommand.txt
│   └── readme.txt
├── part2/                   ← Part 2 (React app)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx
│   │   │   └── BookingContext.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MobileHeader.jsx
│   │   │   ├── TabBar.jsx
│   │   │   └── Modal.jsx
│   │   ├── pages/
│   │   │   ├── BookingPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── MapPage.jsx
│   │   └── styles/
│   │       └── index.css
│   └── dist/                ← Production build output
├── DOC/
│   └── README.md            ← This document
├── includes/
│   └── bootstrap.php        ← Shared DB connection (local dev)
├── .env.example
├── .gitignore
├── booking.php              ← Original root files (local dev)
├── admin.php
└── mysqlcommand.txt
```
