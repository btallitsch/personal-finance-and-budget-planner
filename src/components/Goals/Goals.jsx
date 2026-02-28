import { useState } from "react";
import Modal    from "../UI/Modal";
import StatCard from "../UI/StatCard";
import GoalForm from "./GoalForm";
import { fmtMoney, daysLeft } from "../../utils/helpers";

/* ─── Deposit Modal ──────────────────────────────────────────── */
function DepositModal({ goal, onDeposit, onClose }) {
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) return;
    onDeposit(goal.id, amt);
    onClose();
  };

  return (
    <Modal title={`Deposit to ${goal.name}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="form-label">Amount to Deposit ($)</label>
          <input
            type="number" placeholder="100"
            value={amount} onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleDeposit}>Deposit</button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Goal Card ──────────────────────────────────────────────── */
function GoalCard({ goal, onEdit, onDelete, onDeposit }) {
  const pct  = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const days = daysLeft(goal.deadline);
  const done = goal.saved >= goal.target;
  const monthlyNeeded = days && !done ? ((goal.target - goal.saved) / (days / 30)).toFixed(0) : null;

  return (
    <div
      className="card fade-in"
      style={{ border: done ? "1px solid var(--green)" : "1px solid var(--border)" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            {goal.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{goal.name}</div>
            {goal.deadline && (
              <div style={{ fontSize: 12, color: days && days < 30 ? "var(--red)" : "var(--muted)" }}>
                {done ? "🎉 Completed!" : `${days} days left`}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-icon" onClick={() => onEdit(goal)}>✏️</button>
          <button className="btn-danger" onClick={() => onDelete(goal.id)}>✕</button>
        </div>
      </div>

      {/* Amount */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: done ? "var(--green)" : "var(--amber)" }}>
          {fmtMoney(goal.saved)}
        </span>
        <span style={{ color: "var(--muted)", fontSize: 14, alignSelf: "flex-end", marginBottom: 2 }}>
          of {fmtMoney(goal.target)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="savings-bar-wrap" style={{ height: 12 }}>
        <div
          className="savings-bar"
          style={{ width: `${pct}%`, background: done ? "var(--green)" : "var(--amber)", fontSize: 10 }}
        >
          {pct > 25 && `${pct}%`}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        {monthlyNeeded ? (
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            ~{fmtMoney(monthlyNeeded)}/mo to reach goal
          </span>
        ) : done ? (
          <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>Goal reached! 🎉</span>
        ) : <span />}

        {!done && (
          <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => onDeposit(goal)}>
            + Deposit
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Goals (main export) ────────────────────────────────────── */
export default function Goals({ goals, setGoals }) {
  const [showForm,    setShowForm]    = useState(false);
  const [editGoal,    setEditGoal]    = useState(null);
  const [depositGoal, setDepositGoal] = useState(null);

  const handleSave = (goal) => {
    setGoals((prev) => {
      const idx = prev.findIndex((g) => g.id === goal.id);
      return idx >= 0 ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, goal];
    });
  };

  const handleDelete  = (id)  => setGoals((prev) => prev.filter((g) => g.id !== id));
  const handleEdit    = (g)   => { setEditGoal(g); setShowForm(true); };
  const handleDeposit = (g)   => setDepositGoal(g);
  const applyDeposit  = (id, amt) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amt) } : g));
  };

  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalSaved  = goals.reduce((a, g) => a + g.saved,  0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 26 }}>Savings Goals</h2>
        <button className="btn-primary" onClick={() => { setEditGoal(null); setShowForm(true); }}>
          + New Goal
        </button>
      </div>

      {/* Summary stats */}
      {goals.length > 0 && (
        <div className="grid-3 fade-in">
          <StatCard label="Total Target" value={fmtMoney(totalTarget)} icon="🎯" color="var(--amber)" />
          <StatCard label="Total Saved"  value={fmtMoney(totalSaved)}  icon="🏦" color="var(--green)" />
          <StatCard
            label="Remaining"
            value={fmtMoney(totalTarget - totalSaved)}
            icon="📈"
            color="var(--blue)"
            sub={`${Math.round((totalSaved / totalTarget) * 100) || 0}% funded overall`}
          />
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 8 }}>Set your first goal</h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
            Track your savings journey for anything important to you.
          </p>
          <button className="btn-primary" onClick={() => { setEditGoal(null); setShowForm(true); }}>
            Create a Goal
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDeposit={handleDeposit}
            />
          ))}
        </div>
      )}

      {/* Goal form modal */}
      {showForm && (
        <Modal
          title={editGoal ? "Edit Goal" : "New Savings Goal"}
          onClose={() => setShowForm(false)}
        >
          <GoalForm initial={editGoal} onSave={handleSave} onClose={() => setShowForm(false)} />
        </Modal>
      )}

      {/* Deposit modal */}
      {depositGoal && (
        <DepositModal
          goal={depositGoal}
          onDeposit={applyDeposit}
          onClose={() => setDepositGoal(null)}
        />
      )}
    </div>
  );
}
