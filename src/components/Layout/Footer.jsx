/**
 * Footer — app footer with privacy note and data reset option.
 */
export default function Footer() {
  const handleReset = () => {
    if (confirm("Reset all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      <span>Finesse · Privacy-first budgeting · All data stays on your device</span>
      <button
        style={{ background: "transparent", color: "var(--muted)", fontSize: 12, padding: 0, cursor: "pointer" }}
        onClick={handleReset}
      >
        Reset Data
      </button>
    </footer>
  );
}
