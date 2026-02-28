import { useState } from "react";
import { today, genId } from "../../utils/helpers";

/**
 * TxForm — add or edit a transaction.
 * @param {object[]} categories
 * @param {object}   [initial]  - pre-populate when editing
 * @param {function} onSave
 * @param {function} onClose
 */
export default function TxForm({ categories, initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || {
      date:       today(),
      desc:       "",
      amount:     "",
      categoryId: categories[0]?.id || "",
      type:       "expense",
      notes:      "",
    }
  );

  const f = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.desc || !form.amount || isNaN(+form.amount)) return;
    onSave({ ...form, id: form.id || genId(), amount: +form.amount });
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="grid-2">
        <div>
          <label className="form-label">Date</label>
          <input type="date" value={form.date} onChange={(e) => f("date", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Type</label>
          <select value={form.type} onChange={(e) => f("type", e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Description</label>
        <input
          placeholder="e.g. Grocery run"
          value={form.desc}
          onChange={(e) => f("desc", e.target.value)}
        />
      </div>

      <div className="grid-2">
        <div>
          <label className="form-label">Amount ($)</label>
          <input
            type="number" placeholder="0"
            value={form.amount}
            onChange={(e) => f("amount", e.target.value)}
            min="0" step="0.01"
          />
        </div>
        <div>
          <label className="form-label">Category</label>
          <select value={form.categoryId} onChange={(e) => f("categoryId", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Notes (optional)</label>
        <input
          placeholder="Any additional notes..."
          value={form.notes}
          onChange={(e) => f("notes", e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
          Save Transaction
        </button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
