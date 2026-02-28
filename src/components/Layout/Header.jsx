const TABS = [
  { id: "dashboard",    label: "📊 Overview"    },
  { id: "transactions", label: "📋 Transactions" },
  { id: "budget",       label: "💰 Budget"       },
  { id: "goals",        label: "🎯 Goals"        },
];

/**
 * Header — sticky app header with logo and tab navigation.
 */
export default function Header({ activeTab, onTabChange }) {
  const now = new Date();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--surface)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--amber)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 18,
          }}
        >
          💎
        </div>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
            Finesse
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
            PERSONAL FINANCE
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav
        style={{
          display: "flex", gap: 4,
          background: "var(--bg)", padding: 4,
          borderRadius: 12, border: "1px solid var(--border)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Current month */}
      <div style={{ fontSize: 13, color: "var(--muted)" }}>
        {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </div>
    </header>
  );
}
