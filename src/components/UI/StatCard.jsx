/**
 * StatCard — displays a key metric with label, value, icon, and optional subtitle.
 */
export default function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>

      <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: color || "var(--text)" }}>
        {value}
      </div>

      {sub && <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}
