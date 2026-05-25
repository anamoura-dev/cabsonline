/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: Icons.jsx
    Description: Collection of reusable SVG icon components used throughout the app.
    Each icon merges caller props with defaults so size and colour can be overridden.
*/

// Shared defaults — callers can override any of these via props
const defaultProps = { width: 20, height: 20, strokeWidth: 1.8, stroke: "currentColor", fill: "none" };

export function CarIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17h14v-5l-2-6H7L5 12v5z" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function ClipboardIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

export function ChartIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="6" width="4" height="14" rx="1" />
      <rect x="17" y="2" width="4" height="18" rx="1" />
    </svg>
  );
}

export function MapPinIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function SunIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function SearchIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function EditIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function TrashIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function ListIcon(props) {
  const p = { ...defaultProps, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function UserIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function PhoneIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function CalendarIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function NavigationIcon(props) {
  const p = { ...defaultProps, width: 14, height: 14, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export function RefreshIcon(props) {
  const p = { ...defaultProps, width: 16, height: 16, ...props };
  return (
    <svg viewBox="0 0 24 24" width={p.width} height={p.height} fill={p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
