import { useState, useRef } from "react";
import Modal  from "../UI/Modal";
import Alert  from "../UI/Alert";
import TxForm from "./TxForm";
import { genId, today, fmtMoney } from "../../utils/helpers";

/* ─── CSV Importer ───────────────────────────────────────────── */
function importCSV(text, categories) {
  const lines  = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));

  const get = (row, keys) => {
    for (const k of keys) {
      const i = header.indexOf(k);
      if (i >= 0 && row[i]) return row[i].trim().replace(/"/g, "");
    }
    return "";
  };

  const imported = [];
  for (let i = 1; i < lines.length; i++) {
    const row    = lines[i].split(",");
    const date   = get(row, ["date"]) || today();
    const desc   = get(row, ["description", "desc", "name", "merchant"]);
    const amtRaw = get(row, ["amount", "debit", "credit", "sum"]);
    const amount = Math.abs(parseFloat(amtRaw));

    if (!desc || isNaN(amount) || amount === 0) continue;

    const type = parseFloat(amtRaw) < 0 || get(row, ["type"]) === "debit" ? "expense" : "income";
    imported.push({
      id: genId(), date, desc, amount, type,
      categoryId: categories[0]?.id || "",
      notes: "CSV import",
    });
  }

  return imported;
}

/* ─── Transaction Row ────────────────────────────────────────── */
function TxRow({ tx, cat, onEdit, onDelete }) {
  return (
    <tr>
      <td style={{ color: "var(--muted)", fontSize: 13 }}>{tx.date}</td>
      <td>
        <div style={{ fontWeight: 500 }}>{tx.desc}</div>
        {tx.notes && <div style={{ fontSize: 12, color: "var(--muted)" }}>{tx.notes}</div>}
      </td>
      <td>
        <span
          className="chip"
          style={{
            background: cat ? `${cat.color}22` : "var(--surface)",
            color: cat?.color || "var(--muted)",
          }}
        >
          <span>{cat?.icon || "📦"}</span>
          {cat?.name || "Other"}
        </span>
      </td>
      <td>
        <span style={{ fontSize: 12, color: tx.type === "income" ? "var(--green)" : "var(--red)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {tx.type}
        </span>
      </td>
      <td style={{ textAlign: "right", fontFamily: "var(--serif)", fontWeight: 600, color: tx.type === "income" ? "var(--green)" : "var(--red)" }}>
        {tx.type === "income" ? "+" : "-"}{fmtMoney(tx.amount)}
      </td>
      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <button className="btn-icon" onClick={() => onEdit(tx)}>✏️</button>
        <button className="btn-danger" onClick={() => onDelete(tx.id)}>✕</button>
      </td>
    </tr>
  );
}

/* ─── Transactions (main export) ─────────────────────────────── */
export default function Transactions({ transactions, setTransactions, categories }) {
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [filter,   setFilter]   = useState({ type: "all", cat: "all", search: "" });
  const [csvMsg,   setCsvMsg]   = useState(null);
  const fileRef = useRef();

  const getCat = (id) => categories.find((c) => c.id === id);

  const handleSave = (tx) => {
    setTransactions((prev) => {
      const idx = prev.findIndex((t) => t.id === tx.id);
      return idx >= 0 ? prev.map((t) => (t.id === tx.id ? tx : t)) : [tx, ...prev];
    });
  };

  const handleDelete = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const handleEdit = (tx) => { setEditing(tx); setShowForm(true); };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = importCSV(ev.target.result, categories);
        if (!imported.length) {
          setCsvMsg({ type: "error", text: "No valid rows found. Ensure CSV has: date, description, amount columns." });
          return;
        }
        setTransactions((prev) => [...imported, ...prev]);
        setCsvMsg({ type: "success", text: `✓ Imported ${imported.length} transactions` });
      } catch {
        setCsvMsg({ type: "error", text: "Error parsing CSV. Check format." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filtered = transactions
    .filter((t) => {
      if (filter.type !== "all" && t.type !== filter.type) return false;
      if (filter.cat  !== "all" && t.categoryId !== filter.cat)  return false;
      if (filter.search && !t.desc.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 26 }}>Transactions</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => fileRef.current.click()}>
            ⬆ Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleCSV} />
          <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add Transaction
          </button>
        </div>
      </div>

      {csvMsg && <Alert message={csvMsg.text} type={csvMsg.type} />}

      {/* Filters */}
      <div className="card-sm" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search transactions…"
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          style={{ flex: "1 1 200px" }}
        />
        <select value={filter.type} onChange={(e) => setFilter((p) => ({ ...p, type: e.target.value }))} style={{ width: "auto" }}>
          <option value="all">All Types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <select value={filter.cat} onChange={(e) => setFilter((p) => ({ ...p, cat: e.target.value }))} style={{ width: "auto" }}>
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <TxRow
                  key={t.id}
                  tx={t}
                  cat={getCat(t.categoryId)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal
          title={editing ? "Edit Transaction" : "New Transaction"}
          onClose={() => setShowForm(false)}
        >
          <TxForm
            categories={categories}
            initial={editing}
            onSave={handleSave}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
