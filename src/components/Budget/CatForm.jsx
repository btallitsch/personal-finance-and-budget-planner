import { useState } from "react";
import { genId } from "../../utils/helpers";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../../data/defaults";

/**
 * CatForm — create or edit a budget category.
 */
export default function CatForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: "", budget: "", color: "#e8a838", icon: "📦" }
  );

  const f = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.budget) return;
    onSave({ ...form, id: form.id || genId(), budget: +form.budget });
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="grid-2">
        <div>
          <label className="form-label">Category Name</label>
          <input placeholder="e.g. Dining Out" value={form.name} onChange={(e) => f("name", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Monthly Budget ($)</label>
          <input type="number" placeholder="500" value={form.budget} onChange={(e) => f("budget", e.target.value)} />
        </div>
      </div>

      {/* Icon picker */}
      <div>
        <label className="form-label">Icon</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORY_ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => f("icon", ic)}
              style={{
                width: 38, height: 38, borderRadius: 8, fontSize: 18, cursor: "pointer",
                background: form.icon === ic ? "var(--amber)22" : "var(--surface)",
                border: `1px solid ${form.icon === ic ? "var(--amber)" : "var(--border)"}`,
              }}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="form-label">Color</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {CATEGORY_COLORS.map((col) => (
            <button
              key={col}
              onClick={() => f("color", col)}
              style={{
                width: 32, height: 32, borderRadius: "50%", background: col, cursor: "pointer",
                border: form.color === col ? "3px solid white" : "3px solid transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
          {initial ? "Update" : "Create"} Category
        </button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
