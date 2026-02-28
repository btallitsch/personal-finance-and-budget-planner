import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Modal       from "../UI/Modal";
import ChartTooltip from "../UI/ChartTooltip";
import ProgressBar  from "../UI/ProgressBar";
import CatForm      from "./CatForm";
import { fmtMoney, getCurrentMonth } from "../../utils/helpers";

/* ─── Category Card ──────────────────────────────────────────── */
function CategoryCard({ cat, spent, pct, remaining, onEdit, onDelete }) {
  return (
    <div
      className="card fade-in"
      style={{ borderLeft: `3px solid ${cat.color}` }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{cat.icon}</span>
          <div>
            <div style={{ fontWeight: 600 }}>{cat.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Budget: {fmtMoney(cat.budget)}/mo</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-icon" onClick={() => onEdit(cat)}>✏️</button>
          <button className="btn-danger" onClick={() => onDelete(cat.id)}>✕</button>
        </div>
      </div>

      {/* Spend stats */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
        <span>
          Spent:{" "}
          <strong
            style={{
              fontFamily: "var(--serif)",
              color: pct > 90 ? "var(--red)" : pct > 70 ? "var(--amber)" : "var(--text)",
            }}
          >
            {fmtMoney(spent)}
          </strong>
        </span>
        <span style={{ color: remaining < 0 ? "var(--red)" : "var(--green)" }}>
          {remaining < 0 ? `Over by ${fmtMoney(-remaining)}` : `Left: ${fmtMoney(remaining)}`}
        </span>
      </div>

      <ProgressBar pct={pct} />
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, textAlign: "right" }}>
        {Math.round(pct)}% used
      </div>
    </div>
  );
}

/* ─── Budget (main export) ───────────────────────────────────── */
export default function Budget({ transactions, categories, setCategories }) {
  const [showForm, setShowForm] = useState(false);
  const [editCat,  setEditCat]  = useState(null);

  const currentMonth = getCurrentMonth();
  const monthTxs     = transactions.filter((t) => t.date.startsWith(currentMonth) && t.type === "expense");

  const catData = categories.map((c) => {
    const spent     = monthTxs.filter((t) => t.categoryId === c.id).reduce((a, t) => a + t.amount, 0);
    const pct       = c.budget > 0 ? Math.min(100, (spent / c.budget) * 100) : 0;
    const remaining = c.budget - spent;
    return { ...c, spent, pct, remaining };
  });

  const barData = catData
    .filter((c) => c.budget > 0)
    .map((c) => ({ name: `${c.icon} ${c.name}`, Budget: c.budget, Spent: c.spent }));

  const handleSave = (cat) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === cat.id);
      return idx >= 0 ? prev.map((c) => (c.id === cat.id ? cat : c)) : [...prev, cat];
    });
  };

  const handleEdit   = (cat) => { setEditCat(cat); setShowForm(true); };
  const handleDelete = (id)  => setCategories((prev) => prev.filter((c) => c.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 26 }}>Budget</h2>
        <button className="btn-primary" onClick={() => { setEditCat(null); setShowForm(true); }}>
          + New Category
        </button>
      </div>

      {/* Bar chart */}
      {barData.length > 0 && (
        <div className="card fade-in">
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 20 }}>Budget vs. Actual</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a25" />
              <XAxis dataKey="name" tick={{ fill: "#7a7870", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7a7870", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
              <Bar dataKey="Budget" fill="#2a2a25"       radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent"  fill="var(--amber)"  radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category cards */}
      <div className="grid-2">
        {catData.map((c) => (
          <CategoryCard
            key={c.id}
            cat={c}
            spent={c.spent}
            pct={c.pct}
            remaining={c.remaining}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <Modal
          title={editCat ? "Edit Category" : "New Category"}
          onClose={() => setShowForm(false)}
        >
          <CatForm initial={editCat} onSave={handleSave} onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
