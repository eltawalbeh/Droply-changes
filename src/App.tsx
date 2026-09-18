import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { isSupabaseConfigured } from "./lib/supabase";

const navItems = [
  ["Dashboard", "/station"],
  ["Orders", "/station/orders"],
  ["Customers", "/station/customers"],
  ["Drivers", "/station/drivers"],
  ["Service Areas", "/station/service-areas"],
  ["Locations", "/station/locations"],
  ["QR Codes", "/station/qr-codes"],
  ["Payments", "/station/payments"],
  ["Reports", "/station/reports"],
  ["Settings", "/station/settings"],
] as const;

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Droply</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="empty-state">
        <h2>No data yet</h2>
        <p>This screen is connected to the product structure only. No demo records or fake actions are included.</p>
      </div>
    </section>
  );
}

function StationLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <strong>Droply</strong>
            <span>Station Console</span>
          </div>
        </div>
        <nav>
          {navItems.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/station"}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {!isSupabaseConfigured && (
          <div className="config-banner">
            Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}
        <Routes>
          <Route index element={<PlaceholderPage title="Dashboard" description="Operational overview for the selected water station." />} />
          <Route path="orders" element={<PlaceholderPage title="Orders" description="Incoming, active and completed customer orders." />} />
          <Route path="customers" element={<PlaceholderPage title="Customers" description="Registered customers linked to this station and its locations." />} />
          <Route path="drivers" element={<PlaceholderPage title="Drivers" description="Drivers and their assigned service areas." />} />
          <Route path="service-areas" element={<PlaceholderPage title="Service Areas" description="Geographic areas used to route orders to the correct driver." />} />
          <Route path="locations" element={<PlaceholderPage title="Locations" description="Station branches, addresses, contact data and payment configuration." />} />
          <Route path="qr-codes" element={<PlaceholderPage title="QR Codes" description="Station and location QR codes used for customer acquisition and registration." />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" description="Cash, CliQ, coupon and pending payment records." />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" description="Operational and commercial reporting without demo metrics." />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="Branding, container types, prices, users and permissions." />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/station" replace />} />
      <Route path="/station/*" element={<StationLayout />} />
      <Route path="*" element={<Navigate to="/station" replace />} />
    </Routes>
  );
}
