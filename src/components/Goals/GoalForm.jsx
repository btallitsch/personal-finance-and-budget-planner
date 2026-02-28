import { useState } from "react";
import { genId } from "../../utils/helpers";
import { GOAL_ICONS } from "../../data/defaults";

/**
 * GoalForm — create or edit a savings goal.
 */
export default function GoalForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: "", target: "", saved: "", icon: "🎯", deadline: "" }
  );

  const f = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.target) return;
    onSave({ ...form, id: form.id || genId(), target: +form.target, saved: +form.saved || 0 });
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label className="form-label">Goal Name</label>
        <input placeholder="e.g. Emergency Fund" value={form.name} onChange={(e) => f("name", e.target.value)} />
      </div>

      <div className="grid-2">
        <div>
          <label className="form-label">Target ($)</label>
          <input type="number" placeholder="10000" value={form.target} onChange={(e) => f("target", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Saved So Far ($)</label>
          <input type="number" placeholder="0" value={form.saved} onChange={(e) => f("saved", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="form-label">Deadline (optional)</label>
        <input type="date" value={form.deadline} onChange={(e) => f("deadline", e.target.value)} />
      </div>

      {/* Icon picker */}
      <div>
        <label className="form-label">Icon</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GOAL_ICONS.map((ic) => (
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

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
          {initial ? "Update" : "Create"} Goal
        </button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
