import { useEffect } from "react";

/**
 * Modal — full-screen backdrop with centered card dialog.
 * Closes on Escape key or backdrop click.
 */
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal fade-in">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: "transparent", color: "var(--muted)", fontSize: 22, lineHeight: 1, padding: "4px 8px" }}
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
